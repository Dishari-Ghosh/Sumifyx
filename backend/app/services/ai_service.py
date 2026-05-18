import time
from google import genai
from app.config import settings

client = genai.Client(api_key=settings.GEMINI_API_KEY)

# Use lighter + faster model
MODEL = "gemini-1.5-flash-8b"

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

    # Reduced limit for stability
    MAX_CHARS = 10000

    for page in pages_data[:5]:

        if page["text"]:

            page_content = (
                f"\n[Page {page['page_number']}]\n"
                f"{page['text']}\n"
            )

            # Mention image count only
            if page.get("images"):
                page_content += (
                    f"[Images on this page: "
                    f"{len(page['images'])}]\n"
                )

            # Prevent huge prompts
            if total_chars + len(page_content) > MAX_CHARS:
                content += (
                    "\n[Note: Remaining pages truncated "
                    "to stay within Gemini limits]\n"
                )
                break

            content += page_content
            total_chars += len(page_content)

    return content


def build_prompt(
    doc_type: str,
    content: str,
    mcq_count: int = 10
) -> str:

    if doc_type == "study_material":

        return (
            "You are an expert academic note maker.\n\n"

            "Below is study material extracted from a PDF.\n"

            "Tasks:\n"
            "1. Create structured notes.\n"
            "2. Cover ALL important topics.\n"
            "3. Use headings and subheadings.\n"
            "4. Mention page references like (Page X).\n"
            "5. Keep explanations concise but informative.\n"
            f"6. Generate exactly {mcq_count} MCQs.\n\n"

            "MCQ Format:\n"
            "Q1. Question?\n"
            "a) Option\n"
            "b) Option\n"
            "c) Option\n"
            "d) Option\n"
            "Answer: a)\n\n"

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


def generate_with_gemini(prompt: str) -> str:

    retries = 5

    for attempt in range(retries):

        try:

            print(
                f"Gemini Request Attempt: {attempt + 1}"
            )

            response = client.models.generate_content(
                model=MODEL,
                contents=prompt
            )

            print("Gemini Response Success")

            return response.text

        except Exception as e:

            print(
                f"Gemini Error Attempt "
                f"{attempt + 1}: {str(e)}"
            )

            # Wait before retry
            time.sleep(5)

    raise Exception(
        "Gemini API unavailable after multiple retries"
    )
