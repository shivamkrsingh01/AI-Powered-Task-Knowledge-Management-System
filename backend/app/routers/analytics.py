from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.analytics import AnalyticsResponse
from app.services.analytics_service import get_analytics
from app.dependencies.auth import require_admin
from app.models.user import User

router = APIRouter(prefix="/api/analytics", tags=["analytics"])


@router.get("", response_model=AnalyticsResponse)
def get_analytics_endpoint(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    return get_analytics(db)
