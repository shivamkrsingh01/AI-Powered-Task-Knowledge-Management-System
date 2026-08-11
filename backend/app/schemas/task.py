from pydantic import BaseModel
from datetime import datetime, date
from typing import Optional


class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = None
    assigned_to: int
    priority: str = "medium"
    due_date: Optional[date] = None


class TaskUpdate(BaseModel):
    status: Optional[str] = None
    priority: Optional[str] = None
    due_date: Optional[date] = None


class TaskResponse(BaseModel):
    id: int
    title: str
    description: Optional[str]
    status: str
    priority: str
    due_date: Optional[date]
    assigned_to: int
    assigned_to_name: Optional[str]
    created_by: int
    created_by_name: Optional[str]
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True
