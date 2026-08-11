from sqlalchemy.orm import Session
from typing import List, Optional
from app.models.task_comment import TaskComment
from app.models.task import Task
from app.schemas.task_comment import TaskCommentCreate


def create_comment(db: Session, task_id: int, content: str, user_id: int) -> TaskComment:
    comment = TaskComment(
        task_id=task_id,
        user_id=user_id,
        content=content
    )
    db.add(comment)
    db.commit()
    db.refresh(comment)
    return comment


def get_task_comments(db: Session, task_id: int) -> List[TaskComment]:
    return db.query(TaskComment).filter(TaskComment.task_id == task_id).order_by(TaskComment.created_at).all()


def delete_comment(db: Session, comment_id: int, user_id: int) -> bool:
    comment = db.query(TaskComment).filter(TaskComment.id == comment_id).first()
    if not comment or comment.user_id != user_id:
        return False
    db.delete(comment)
    db.commit()
    return True
