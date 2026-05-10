from google import genai
from app.config import settings
client = genai.Client(api_key=settings.GEMINI_API_KEY)
MODEL = "gemini-2.5-flash"
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
    MAX_CHARS = 50000
    for page in pages_data:
        if page["text"]:
            page_content = f"\n[Page {page['page_number']}]\n{page['text']}\n"
            if page.get("images"):
                page_content += f"[Images on this page: {len(page['images'])}]\n"
            total_chars += len(page_content)
            if total_chars > MAX_CHARS:
                content += "\n[Note: Remaining pages truncated to stay within limits]\n"
                break
            content += page_content

    return content
def build_prompt(doc_type: str, content: str, mcq_count: int = 10) -> str:
    if doc_type == "study_material":
        return (
            "You are an expert note-maker for students.\n"
            "Below is the full content of a study material PDF organized by page numbers.\n\n"
            "Your tasks:\n"
            "1. Create detailed well-structured notes covering ALL the content.\n"
            "2. After every major point mention which page it came from like: (Page X)\n"
            "3. Use proper headings and subheadings.\n"
            "4. Do NOT skip any page or topic.\n"
            f"5. At the end generate {mcq_count} MCQs based on the full content.\n"
            "   Format MCQs as:\n"
            "   Q1. Question here?\n"
            "   a) Option 1\n"
            "   b) Option 2\n"
            "   c) Option 3\n"
            "   d) Option 4\n"
            "   Answer: b)\n\n"
            "PDF Content:\n"
            + content
        )
    elif doc_type == "research_paper":
        return (
            "You are an expert research analyst.\n"
            "Below is the full content of a research paper organized by page numbers.\n\n"
            "Your tasks:\n"
            "1. Write a concise but comprehensive summary.\n"
            "2. Cover: Objective, Methodology, Key Findings, Conclusion.\n"
            "3. Mention page references like: (Page X)\n"
            "4. Do NOT generate MCQs.\n\n"
            "PDF Content:\n"
            + content
        )
    elif doc_type == "business_paper":
        return (
            "You are a business analyst assistant.\n"
            "Below is the full content of a business document organized by page numbers.\n\n"
            "Your tasks:\n"
            "1. Summarize in clear bullet points.\n"
            "2. Group bullets under: Key Points, Decisions, Action Items, Conclusions.\n"
            "3. Mention page references like: (Page X)\n"
            "4. Do NOT generate MCQs.\n\n"
            "PDF Content:\n"
            + content
        )
    elif doc_type == "patent":
        return (
            "You are a patent analyst.\n"
            "Below is the full content of a patent document organized by page numbers.\n\n"
            "Your tasks:\n"
            "1. Summarize covering: invention title, problem solved, technical approach, claims.\n"
            "2. Use simple language so non-experts can understand.\n"
            "3. Mention page references like: (Page X)\n"
            "4. Do NOT generate MCQs.\n\n"
            "PDF Content:\n"
            + content
        )
    else:
        return "Summarize the following content:\n" + content
def generate_with_gemini(prompt: str) -> str:
    response = client.models.generate_content(
        model=MODEL,
        contents=prompt
    )
    return response.text