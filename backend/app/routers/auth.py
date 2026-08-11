from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.auth import LoginRequest, LoginResponse
from app.services.auth_service import authenticate_user, create_user_token
from app.models.activity_log import ActivityLog

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/login", response_model=LoginResponse)
def login(request: LoginRequest, db: Session = Depends(get_db)):
    user = authenticate_user(db, request.email, request.password)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    access_token = create_user_token(user)
    
    # Log login activity
    log = ActivityLog(
        user_id=user.id,
        action="LOGIN",
        details=f"User {user.email} logged in"
    )
    db.add(log)
    db.commit()
    
    return LoginResponse(
        access_token=access_token,
        user_id=user.id,
        email=user.email,
        role=user.role.name
    )
