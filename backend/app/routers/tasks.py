from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import Optional
from app.core.database import get_db
from app.schemas.task import TaskCreate, TaskUpdate, TaskResponse
from app.services.task_service import create_task, get_tasks, get_task_by_id, update_task_status
from app.dependencies.auth import get_current_user, require_admin
from app.models.user import User
from app.models.activity_log import ActivityLog

router = APIRouter(prefix="/api/tasks", tags=["tasks"])

# Valid status and priority options
VALID_STATUSES = ["pending", "in_progress", "completed", "blocked", "on_hold"]
VALID_PRIORITIES = ["low", "medium", "high", "urgent"]


@router.post("", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
def create_task_endpoint(
    task: TaskCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    # Validate priority
    if task.priority not in VALID_PRIORITIES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid priority. Must be one of: {', '.join(VALID_PRIORITIES)}"
        )
    
    db_task = create_task(db, task, current_user.id)
    
    # Log task creation
    log = ActivityLog(
        user_id=current_user.id,
        action="TASK_CREATE",
        details=f"Created task '{task.title}' assigned to user {task.assigned_to} with priority {task.priority}"
    )
    db.add(log)
    db.commit()
    
    # Load relationships for response
    db.refresh(db_task)
    return TaskResponse(
        id=db_task.id,
        title=db_task.title,
        description=db_task.description,
        status=db_task.status,
        priority=db_task.priority,
        due_date=db_task.due_date,
        assigned_to=db_task.assigned_to,
        assigned_to_name=db_task.assignee.name if db_task.assignee else None,
        created_by=db_task.created_by,
        created_by_name=db_task.creator.name if db_task.creator else None,
        created_at=db_task.created_at,
        updated_at=db_task.updated_at
    )


@router.get("", response_model=list[TaskResponse])
def get_tasks_endpoint(
    status: Optional[str] = Query(None),
    priority: Optional[str] = Query(None),
    assigned_to: Optional[int] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Validate filters
    if status and status not in VALID_STATUSES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid status. Must be one of: {', '.join(VALID_STATUSES)}"
        )
    if priority and priority not in VALID_PRIORITIES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid priority. Must be one of: {', '.join(VALID_PRIORITIES)}"
        )
    
    # Admin can see all tasks, users only see their assigned tasks
    user_id = None if current_user.role.name == "Admin" else current_user.id
    
    tasks = get_tasks(db, user_id=user_id, status=status, assigned_to=assigned_to, priority=priority)
    
    return [
        TaskResponse(
            id=task.id,
            title=task.title,
            description=task.description,
            status=task.status,
            priority=task.priority,
            due_date=task.due_date,
            assigned_to=task.assigned_to,
            assigned_to_name=task.assignee.name if task.assignee else None,
            created_by=task.created_by,
            created_by_name=task.creator.name if task.creator else None,
            created_at=task.created_at,
            updated_at=task.updated_at
        )
        for task in tasks
    ]


@router.get("/{task_id}", response_model=TaskResponse)
def get_task_endpoint(
    task_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    task = get_task_by_id(db, task_id)
    
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    
    # Users can only view their assigned tasks
    if current_user.role.name != "Admin" and task.assigned_to != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )
    
    return TaskResponse(
        id=task.id,
        title=task.title,
        description=task.description,
        status=task.status,
        priority=task.priority,
        due_date=task.due_date,
        assigned_to=task.assigned_to,
        assigned_to_name=task.assignee.name if task.assignee else None,
        created_by=task.created_by,
        created_by_name=task.creator.name if task.creator else None,
        created_at=task.created_at,
        updated_at=task.updated_at
    )


@router.patch("/{task_id}", response_model=TaskResponse)
def update_task_endpoint(
    task_id: int,
    task_update: TaskUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Validate status if provided
    if task_update.status and task_update.status not in VALID_STATUSES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid status. Must be one of: {', '.join(VALID_STATUSES)}"
        )
    
    # Validate priority if provided
    if task_update.priority and task_update.priority not in VALID_PRIORITIES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid priority. Must be one of: {', '.join(VALID_PRIORITIES)}"
        )
    
    task = update_task_status(db, task_id, task_update, current_user.id)
    
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found or access denied"
        )
    
    # Log task update
    log = ActivityLog(
        user_id=current_user.id,
        action="TASK_UPDATE",
        details=f"Updated task {task_id}"
    )
    db.add(log)
    db.commit()
    
    return TaskResponse(
        id=task.id,
        title=task.title,
        description=task.description,
        status=task.status,
        priority=task.priority,
        due_date=task.due_date,
        assigned_to=task.assigned_to,
        assigned_to_name=task.assignee.name if task.assignee else None,
        created_by=task.created_by,
        created_by_name=task.creator.name if task.creator else None,
        created_at=task.created_at,
        updated_at=task.updated_at
    )
