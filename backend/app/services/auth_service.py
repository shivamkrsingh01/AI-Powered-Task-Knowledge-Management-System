from sqlalchemy.orm import Session
from app.models.user import User
from app.models.role import Role
from app.core.security import verify_password, create_access_token
from datetime import timedelta


def authenticate_user(db: Session, email: str, password: str) -> User | None:
    user = db.query(User).filter(User.email == email).first()
    if not user:
        return None
    if not verify_password(password, user.password_hash):
        return None
    return user


def create_user_token(user: User) -> str:
    access_token = create_access_token(
        data={"sub": str(user.id), "email": user.email, "role": user.role.name}
    )
    return access_token
