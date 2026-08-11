from pydantic import BaseModel
from datetime import datetime


class DocumentResponse(BaseModel):
    id: int
    filename: str
    file_type: str
    uploaded_by: int
    uploaded_by_name: str | None
    created_at: datetime
    
    class Config:
        from_attributes = True
