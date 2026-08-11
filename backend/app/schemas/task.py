from pydantic import BaseModel
from datetime import datetime


class TaskCreate(BaseModel):
    title: str
    description: str | None = None
    assigned_to: int


class TaskUpdate(BaseModel):
    status: str


class TaskResponse(BaseModel):
    id: int
    title: str
    description: str | None
    status: str
    assigned_to: int
    assigned_to_name: str | None
    created_by: int
    created_by_name: str | None
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True
