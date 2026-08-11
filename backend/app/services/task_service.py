from sqlalchemy.orm import Session
from typing import Optional, List
from app.models.task import Task
from app.models.user import User
from app.schemas.task import TaskCreate, TaskUpdate


def create_task(db: Session, task: TaskCreate, created_by_id: int) -> Task:
    db_task = Task(
        title=task.title,
        description=task.description,
        assigned_to=task.assigned_to,
        created_by=created_by_id,
        status="pending"
    )
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task


def get_tasks(
    db: Session,
    user_id: Optional[int] = None,
    status: Optional[str] = None,
    assigned_to: Optional[int] = None
) -> List[Task]:
    query = db.query(Task)
    
    if user_id is not None:
        # Regular users can only see their assigned tasks
        query = query.filter(Task.assigned_to == user_id)
    
    if status is not None:
        query = query.filter(Task.status == status)
    
    if assigned_to is not None:
        query = query.filter(Task.assigned_to == assigned_to)
    
    return query.all()


def get_task_by_id(db: Session, task_id: int) -> Task | None:
    return db.query(Task).filter(Task.id == task_id).first()


def update_task_status(db: Session, task_id: int, status: str, user_id: int) -> Task | None:
    task = db.query(Task).filter(Task.id == task_id).first()
    
    if not task:
        return None
    
    # Only assigned user can update their own task
    if task.assigned_to != user_id:
        return None
    
    task.status = status
    db.commit()
    db.refresh(task)
    return task
