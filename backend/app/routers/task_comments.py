from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.task_comment import TaskCommentCreate, TaskCommentResponse
from app.services.task_comment_service import create_comment, get_task_comments, delete_comment
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.models.activity_log import ActivityLog

router = APIRouter(prefix="/api/tasks/{task_id}/comments", tags=["task_comments"])


@router.post("", response_model=TaskCommentResponse, status_code=status.HTTP_201_CREATED)
def create_comment_endpoint(
    task_id: int,
    comment: TaskCommentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    from app.models.task import Task
    
    # Check if task exists
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    
    # Check if user has access to the task
    if current_user.role.name != "Admin" and task.assigned_to != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )
    
    db_comment = create_comment(db, task_id, comment.content, current_user.id)
    
    # Log comment creation
    log = ActivityLog(
        user_id=current_user.id,
        action="TASK_COMMENT",
        details=f"Added comment to task {task_id}"
    )
    db.add(log)
    db.commit()
    
    return TaskCommentResponse(
        id=db_comment.id,
        task_id=db_comment.task_id,
        user_id=db_comment.user_id,
        author_name=db_comment.author.name if db_comment.author else None,
        content=db_comment.content,
        created_at=db_comment.created_at
    )


@router.get("", response_model=list[TaskCommentResponse])
def get_comments_endpoint(
    task_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    from app.models.task import Task
    
    # Check if task exists
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    
    # Check if user has access to the task
    if current_user.role.name != "Admin" and task.assigned_to != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )
    
    comments = get_task_comments(db, task_id)
    
    return [
        TaskCommentResponse(
            id=comment.id,
            task_id=comment.task_id,
            user_id=comment.user_id,
            author_name=comment.author.name if comment.author else None,
            content=comment.content,
            created_at=comment.created_at
        )
        for comment in comments
    ]


@router.delete("/{comment_id}")
def delete_comment_endpoint(
    task_id: int,
    comment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    success = delete_comment(db, comment_id, current_user.id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Comment not found or access denied"
        )
    
    # Log comment deletion
    log = ActivityLog(
        user_id=current_user.id,
        action="TASK_COMMENT_DELETE",
        details=f"Deleted comment {comment_id} from task {task_id}"
    )
    db.add(log)
    db.commit()
    
    return {"message": "Comment deleted successfully"}
