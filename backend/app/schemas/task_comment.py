from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class TaskCommentCreate(BaseModel):
    content: str


class TaskCommentResponse(BaseModel):
    id: int
    task_id: int
    user_id: int
    author_name: Optional[str]
    content: str
    created_at: datetime
    
    class Config:
        from_attributes = True
