from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.task import Task
from app.models.activity_log import ActivityLog
from app.schemas.analytics import AnalyticsResponse, SearchQueryCount


def get_analytics(db: Session) -> AnalyticsResponse:
    # Get task statistics
    total_tasks = db.query(func.count(Task.id)).scalar()
    completed_tasks = db.query(func.count(Task.id)).filter(Task.status == "completed").scalar()
    pending_tasks = db.query(func.count(Task.id)).filter(Task.status == "pending").scalar()
    
    # Get most searched queries
    search_counts = (
        db.query(
            ActivityLog.details,
            func.count(ActivityLog.id).label('count')
        )
        .filter(ActivityLog.action == "SEARCH")
        .group_by(ActivityLog.details)
        .order_by(func.count(ActivityLog.id).desc())
        .limit(5)
        .all()
    )
    
    most_searched_queries = []
    for detail, count in search_counts:
        # Extract query from details (format: "Search query: {query}")
        query = detail.replace("Search query: ", "") if detail.startswith("Search query: ") else detail
        most_searched_queries.append(SearchQueryCount(query=query, count=count))
    
    return AnalyticsResponse(
        total_tasks=total_tasks or 0,
        completed_tasks=completed_tasks or 0,
        pending_tasks=pending_tasks or 0,
        most_searched_queries=most_searched_queries
    )
