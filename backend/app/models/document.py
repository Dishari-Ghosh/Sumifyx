from pydantic import BaseModel
from typing import Optional
class DocumentResponse(BaseModel):
    id: str
    filename: str
    doc_type: str
    total_pages: int
    created_at: str