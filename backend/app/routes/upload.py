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

VALID_DOC_TYPES = [
    "study_material",
    "research_paper",
    "business_paper",
    "patent"
]


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
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token"
        )

    user_id = payload.get("sub")

    # Validate doc type
    if doc_type not in VALID_DOC_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid doc_type. Choose from: {VALID_DOC_TYPES}"
        )

    # Validate file
    if not is_valid_pdf(file.filename):
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are allowed"
        )

    # Save file temporarily
    file_bytes = await file.read()

    unique_filename = f"{uuid.uuid4()}_{file.filename}"

    file_path = save_upload_file(
        file_bytes,
        unique_filename
    )

    try:
        print("STEP 1: Parsing PDF")

        # Parse PDF
        parsed = parse_pdf(file_path)

        print("STEP 2: PDF Parsed Successfully")

        # Collect image metadata only
        # (avoid returning huge base64 data)
        all_images = []

        for page in parsed["pages"]:
            for img in page.get("images", []):

                all_images.append({
                    "page_number": img.get("page_number"),
                    "image_index": img.get("image_index"),
                    "ext": img.get("ext")
                })

        print(f"STEP 3: Found {len(all_images)} images")

        print("STEP 4: Starting Gemini generation")

        # Generate notes + MCQs
        result = generate_notes(
            parsed["pages"],
            doc_type,
            parsed["total_pages"]
        )

        print("STEP 5: Gemini generation completed")

        # Save to MongoDB
        document = {
            "user_id": user_id,
            "filename": file.filename,
            "doc_type": doc_type,
            "total_pages": parsed["total_pages"],
            "notes": result.get("notes", ""),
            "mcqs": result.get("mcqs", []),
            "has_mcqs": result.get("has_mcqs", False),
            "mcq_count": result.get("mcq_count", 0),

            # Save image metadata only
            "images": all_images,

            "created_at": datetime.utcnow()
        }

        db["documents"].insert_one(document)

        print("STEP 6: Saved to MongoDB")

        return {
            "message": "Notes generated successfully!",
            "filename": file.filename,
            "doc_type": doc_type,
            "total_pages": parsed["total_pages"],
            "pages_covered": len(parsed["pages"]),

            "notes": result.get("notes", ""),
            "mcqs": result.get("mcqs", []),
            "has_mcqs": result.get("has_mcqs", False),
            "mcq_count": result.get("mcq_count", 0),

            # Only return count
            "total_images": len(all_images)
        }

    except Exception as e:
        print("UPLOAD ERROR:", str(e))

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

    finally:
        delete_file(file_path)
