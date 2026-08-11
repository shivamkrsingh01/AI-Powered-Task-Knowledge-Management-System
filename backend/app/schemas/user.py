from pydantic import BaseModel


class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    role: str
    created_at: str
    
    class Config:
        from_attributes = True
