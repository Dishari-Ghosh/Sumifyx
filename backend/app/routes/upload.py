from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.utils.file_helper import is_valid_pdf, save_upload_file, delete_file
from app.services.pdf_parser import parse_pdf
from app.services.notes_generator import generate_notes
from app.utils.auth_helper import decode_token
from app.db.mongo import db
import uuid
from datetime import datetime

router = APIRouter(prefix="/upload", tags=["Upload"])
security = HTTPBearer()

VALID_DOC_TYPES = ["study_material", "research_paper", "business_paper", "patent"]


@router.post("/pdf")
async def upload_pdf(
    file: UploadFile = File(...),
    doc_type: str = "study_material",
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    # Verify JWT token
    token = credentials.credentials
    payload = decode_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    user_id = payload.get("sub")

    # Validate doc type
    if doc_type not in VALID_DOC_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid doc_type. Choose from: {VALID_DOC_TYPES}"
        )

    # Validate file
    if not is_valid_pdf(file.filename):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")

    # Save file temporarily
    file_bytes = await file.read()
    unique_filename = f"{uuid.uuid4()}_{file.filename}"
    file_path = save_upload_file(file_bytes, unique_filename)

    try:
        # Step 1 - Parse PDF
        parsed = parse_pdf(file_path)

        # Step 2 - Collect all images from all pages
        all_images = []
        for page in parsed["pages"]:
            for img in page.get("images", []):
                all_images.append({
                    "page_number": img["page_number"],
                    "image_index": img["image_index"],
                    "ext": img["ext"],
                    "data_uri": img["data_uri"]
                })

        # Step 3 - Generate notes + MCQs using Gemini
        result = generate_notes(
            parsed["pages"],
            doc_type,
            parsed["total_pages"]
        )

        # Step 4 - Save to MongoDB including images
        document = {
            "user_id": user_id,
            "filename": file.filename,
            "doc_type": doc_type,
            "total_pages": parsed["total_pages"],
            "notes": result["notes"],
            "mcqs": result["mcqs"],
            "has_mcqs": result["has_mcqs"],
            "mcq_count": result.get("mcq_count", 0),
            "images": all_images,  # store images
            "created_at": datetime.utcnow()
        }
        db["documents"].insert_one(document)

        return {
            "message": "Notes generated successfully!",
            "filename": file.filename,
            "doc_type": doc_type,
            "total_pages": parsed["total_pages"],
            "pages_covered": len(parsed["pages"]),
            "notes": result["notes"],
            "mcqs": result["mcqs"],
            "has_mcqs": result["has_mcqs"],
            "mcq_count": result.get("mcq_count", 0),
            "total_images": len(all_images),
            "images": all_images  # return images to frontend
        }

    finally:
        delete_file(file_path)