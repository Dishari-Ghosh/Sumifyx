from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.utils.auth_helper import decode_token
from app.db.mongo import db
from bson import ObjectId

router = APIRouter(prefix="/history", tags=["History"])
security = HTTPBearer()


def get_user_id(credentials: HTTPAuthorizationCredentials) -> str:
    token = credentials.credentials
    payload = decode_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    return payload.get("sub")


@router.get("/")
def get_history(credentials: HTTPAuthorizationCredentials = Depends(security)):
    user_id = get_user_id(credentials)

    documents = list(db["documents"].find(
    {"user_id": user_id},
    {"notes": 0, "mcqs": 0, "images": 0}
    ))

    result = []
    for doc in documents:
        result.append({
            "id": str(doc["_id"]),
            "filename": doc["filename"],
            "doc_type": doc["doc_type"],
            "total_pages": doc["total_pages"],
            "has_mcqs": doc.get("has_mcqs", False),
            "created_at": str(doc["created_at"])
        })

    return {
        "total": len(result),
        "documents": result
    }


@router.get("/{document_id}")
def get_document(
    document_id: str,
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    user_id = get_user_id(credentials)

    try:
        obj_id = ObjectId(document_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid document ID")

    doc = db["documents"].find_one({
        "_id": obj_id,
        "user_id": user_id
    })

    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    return {
        "id": str(doc["_id"]),
        "filename": doc["filename"],
        "doc_type": doc["doc_type"],
        "total_pages": doc["total_pages"],
        "notes": doc["notes"],
        "mcqs": doc["mcqs"],
        "has_mcqs": doc.get("has_mcqs", False),
        "created_at": str(doc["created_at"])
    }


@router.delete("/{document_id}")
def delete_document(
    document_id: str,
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    user_id = get_user_id(credentials)

    try:
        obj_id = ObjectId(document_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid document ID")

    result = db["documents"].delete_one({
        "_id": obj_id,
        "user_id": user_id
    })

    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Document not found")

    return {"message": "Document deleted successfully!"}