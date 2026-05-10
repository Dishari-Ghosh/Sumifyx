import fitz
import base64

def analyze_image(image_bytes: bytes) -> dict:
    try:
        sample = image_bytes[::50]
        avg = sum(sample) / len(sample)
        return {
            "is_dark": avg < 20,
            "is_blank": avg > 200
        }
    except:
        return {"is_dark": False, "is_blank": False}


def is_valid_image(image_bytes: bytes, width: int, height: int) -> bool:
    if len(image_bytes) < 30000:
        return False
    if width < 200 or height < 200:
        return False
    analysis = analyze_image(image_bytes)
    if analysis["is_dark"] or analysis["is_blank"]:
        return False
    aspect_ratio = width / height if height > 0 else 0
    if aspect_ratio > 2.5:
        return False
    # Skip full slide sized images (NPTEL templates)
    if width > 500 and height > 350:
        return False
    return True


def parse_pdf(file_path: str) -> dict:
    doc = fitz.open(file_path)
    total_pages = len(doc)
    pages_data = []

    for page_num in range(total_pages):
        page = doc[page_num]
        text = page.get_text("text").strip()
        word_count = len(text.split())
        images = []

        if word_count >= 30:
            image_list = page.get_images(full=True)

            for img_index, img in enumerate(image_list):
                xref = img[0]
                base_image = doc.extract_image(xref)
                image_bytes = base_image["image"]
                image_ext = base_image["ext"]
                width = base_image.get("width", 0)
                height = base_image.get("height", 0)

                if not is_valid_image(image_bytes, width, height):
                    continue

                image_b64 = base64.b64encode(image_bytes).decode("utf-8")
                images.append({
                    "page_number": page_num + 1,
                    "image_index": img_index,
                    "ext": image_ext,
                    "data_uri": f"data:image/{image_ext};base64,{image_b64}"
                })

        pages_data.append({
            "page_number": page_num + 1,
            "text": text,
            "images": images
        })

    doc.close()

    return {
        "total_pages": total_pages,
        "pages": pages_data
    }