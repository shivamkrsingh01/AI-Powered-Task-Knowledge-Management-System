from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Optional
from app.core.database import get_db
from app.schemas.search import SearchRequest, SearchResponse
from app.services.search_service import search_documents
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.models.activity_log import ActivityLog

router = APIRouter(prefix="/api/search", tags=["search"])


@router.post("", response_model=SearchResponse)
def search_endpoint(
    request: SearchRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if not request.query or not request.query.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Search query cannot be empty"
        )
    
    # Use k from request or default to 10
    k = request.k if request.k is not None else 10
    # Limit k to reasonable range
    k = min(max(k, 1), 20)
    
    results = search_documents(request.query, k=k)
    
    # Log search activity
    log = ActivityLog(
        user_id=current_user.id,
        action="SEARCH",
        details=f"Search query: {request.query}, Results: {len(results)}"
    )
    db.add(log)
    db.commit()
    
    return SearchResponse(
        query=request.query,
        results=results
    )
