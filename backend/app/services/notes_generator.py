from app.services.ai_service import (
    get_content_from_pages,
    build_prompt,
    generate_with_groq,
    calculate_mcq_count
)


def generate_notes(pages_data: list, doc_type: str, total_pages: int = 0) -> dict:
    content = get_content_from_pages(pages_data)
    mcq_count = calculate_mcq_count(pages_data)
    prompt = build_prompt(doc_type, content, mcq_count)
    result = generate_with_groq(prompt)

    if doc_type == "study_material":
        notes = result
        mcqs = ""

        # Try to split on Q1. marker
        if "Q1." in result:
            parts = result.split("Q1.", 1)
            notes = parts[0].strip()
            mcqs = "Q1." + parts[1].strip()

        return {
            "notes": notes,
            "mcqs": mcqs,
            "has_mcqs": bool(mcqs),
            "mcq_count": mcq_count
        }
    else:
        return {
            "notes": result,
            "mcqs": "",
            "has_mcqs": False,
            "mcq_count": 0
        }