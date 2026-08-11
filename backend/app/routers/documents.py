from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.schemas.document import DocumentResponse
from app.services.document_service import (
    save_uploaded_file,
    create_document_record,
    get_all_documents
)
from app.services.search_service import process_document_for_search
from app.dependencies.auth import get_current_user, require_admin
from app.models.user import User
from app.models.activity_log import ActivityLog

router = APIRouter(prefix="/api/documents", tags=["documents"])


@router.post("", response_model=DocumentResponse, status_code=status.HTTP_201_CREATED)
def upload_document(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    file_path, file_type = save_uploaded_file(file, current_user.id)
    
    document = create_document_record(
        db,
        file.filename,
        file_type,
        file_path,
        current_user.id
    )
    
    # Process document for semantic search
    process_document_for_search(document.id, file_path, file_type, file.filename)
    
    # Log document upload
    log = ActivityLog(
        user_id=current_user.id,
        action="DOCUMENT_UPLOAD",
        details=f"Uploaded document: {file.filename}"
    )
    db.add(log)
    db.commit()
    
    # Load relationship for response
    db.refresh(document)
    return DocumentResponse(
        id=document.id,
        filename=document.filename,
        file_type=document.file_type,
        uploaded_by=document.uploaded_by,
        uploaded_by_name=document.uploader.name if document.uploader else None,
        created_at=document.created_at
    )


@router.get("", response_model=List[DocumentResponse])
def get_documents(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    documents = get_all_documents(db)
    
    return [
        DocumentResponse(
            id=doc.id,
            filename=doc.filename,
            file_type=doc.file_type,
            uploaded_by=doc.uploaded_by,
            uploaded_by_name=doc.uploader.name if doc.uploader else None,
            created_at=doc.created_at
        )
        for doc in documents
    ]
