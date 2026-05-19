import time
from groq import Groq
from app.config import settings

client = Groq(api_key=settings.GROQ_API_KEY)
MODEL = "llama-3.3-70b-versatile"


def calculate_mcq_count(pages_data: list) -> int:
    total_words = 0
    for page in pages_data:
        if page["text"]:
            total_words += len(page["text"].split())
    mcq_count = total_words // 100
    return max(5, min(25, mcq_count))


def get_content_from_pages(pages_data: list) -> str:
    content = ""
    total_chars = 0
    MAX_CHARS = 10000

    for page in pages_data:
        if page["text"]:
            page_content = (
                f"\n[Page {page['page_number']}]\n"
                f"{page['text']}\n"
            )
            if page.get("images"):
                page_content += (
                    f"[Images on this page: "
                    f"{len(page['images'])}]\n"
                )
            if total_chars + len(page_content) > MAX_CHARS:
                content += "\n[Note: Remaining pages truncated]\n"
                break
            content += page_content
            total_chars += len(page_content)

    return content


def build_prompt(doc_type: str, content: str, mcq_count: int = 10) -> str:

    if doc_type == "study_material":
        return (
            "You are an expert academic note maker.\n\n"
            "Below is study material extracted from a PDF.\n\n"
            "TASKS:\n"
            "1. Create structured notes covering ALL topics.\n"
            "2. Use headings and subheadings.\n"
            "3. Mention page references like (Page X).\n"
            "4. Keep explanations concise but informative.\n"
            f"5. After the notes, generate exactly {mcq_count} MCQs.\n\n"
            "IMPORTANT: Start the MCQ section with exactly this line:\n"
            "Q1. [question here]\n\n"
            "MCQ FORMAT (follow EXACTLY, each on its own line):\n"
            "Q1. Question here?\n"
            "a) Option one\n"
            "b) Option two\n"
            "c) Option three\n"
            "d) Option four\n"
            "Answer: a)\n"
            "\n"
            "Q2. Question here?\n"
            "a) Option one\n"
            "b) Option two\n"
            "c) Option three\n"
            "d) Option four\n"
            "Answer: b)\n"
            "\n"
            "PDF Content:\n"
            f"{content}"
        )

    elif doc_type == "research_paper":
        return (
            "You are an expert research paper summarizer.\n\n"
            "Tasks:\n"
            "1. Summarize the paper clearly.\n"
            "2. Cover objective, methodology, results, conclusion.\n"
            "3. Mention page references.\n"
            "4. Use concise academic language.\n"
            "5. Do NOT generate MCQs.\n\n"
            "PDF Content:\n"
            f"{content}"
        )

    elif doc_type == "business_paper":
        return (
            "You are a business analyst.\n\n"
            "Tasks:\n"
            "1. Summarize into bullet points.\n"
            "2. Group into:\n"
            "- Key Points\n"
            "- Decisions\n"
            "- Action Items\n"
            "- Conclusions\n"
            "3. Mention page references.\n"
            "4. Do NOT generate MCQs.\n\n"
            "PDF Content:\n"
            f"{content}"
        )

    elif doc_type == "patent":
        return (
            "You are a patent analyst.\n\n"
            "Tasks:\n"
            "1. Explain the invention simply.\n"
            "2. Cover:\n"
            "- Problem solved\n"
            "- Technical idea\n"
            "- Claims\n"
            "- Benefits\n"
            "3. Mention page references.\n"
            "4. Do NOT generate MCQs.\n\n"
            "PDF Content:\n"
            f"{content}"
        )

    else:
        return f"Summarize this content:\n{content}"


def generate_with_groq(prompt: str) -> str:
    retries = 3
    for attempt in range(retries):
        try:
            print(f"Groq Request Attempt: {attempt + 1}")
            response = client.chat.completions.create(
                model=MODEL,
                messages=[
                    {"role": "user", "content": prompt}
                ],
                max_tokens=4096
            )
            print("Groq Response Success")
            return response.choices[0].message.content
        except Exception as e:
            print(f"Groq Error Attempt {attempt + 1}: {str(e)}")
            time.sleep(3)
    raise Exception("Groq API unavailable after multiple retries")