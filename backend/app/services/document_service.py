import os
from typing import List
from sqlalchemy.orm import Session
from fastapi import UploadFile, HTTPException
from app.models.document import Document
from PyPDF2 import PdfReader


ALLOWED_FILE_TYPES = {"pdf", "txt"}
UPLOAD_DIR = "uploads"


def validate_file_type(filename: str) -> str:
    file_extension = filename.split(".")[-1].lower()
    if file_extension not in ALLOWED_FILE_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type. Allowed types: {', '.join(ALLOWED_FILE_TYPES)}"
        )
    return file_extension


def extract_text_from_pdf(file_path: str) -> str:
    reader = PdfReader(file_path)
    text = ""
    for page in reader.pages:
        text += page.extract_text()
    return text


def extract_text_from_txt(file_path: str) -> str:
    with open(file_path, "r", encoding="utf-8") as f:
        return f.read()


def extract_text(file_path: str, file_type: str) -> str:
    if file_type == "pdf":
        return extract_text_from_pdf(file_path)
    elif file_type == "txt":
        return extract_text_from_txt(file_path)
    else:
        raise ValueError(f"Unsupported file type: {file_type}")


def chunk_text(text: str, chunk_size: int = 500, overlap: int = 50) -> List[str]:
    """Split text into chunks respecting sentence boundaries for better context"""
    import re
    
    # Split into sentences first
    sentences = re.split(r'(?<=[.!?])\s+', text)
    
    chunks = []
    current_chunk = ""
    
    for sentence in sentences:
        # If adding this sentence would exceed chunk size, save current chunk
        if len(current_chunk) + len(sentence) > chunk_size and current_chunk:
            chunks.append(current_chunk.strip())
            # Start new chunk with overlap from previous chunk
            words = current_chunk.split()
            overlap_words = words[-min(len(words), overlap // 5):]  # Approximate overlap
            current_chunk = " ".join(overlap_words) + " " if overlap_words else ""
        
        current_chunk += sentence + " "
    
    # Add remaining content
    if current_chunk.strip():
        chunks.append(current_chunk.strip())
    
    return chunks


def save_uploaded_file(file: UploadFile, user_id: int) -> tuple:
    # Validate file type
    file_type = validate_file_type(file.filename)
    
    # Create upload directory if it doesn't exist
    os.makedirs(UPLOAD_DIR, exist_ok=True)
    
    # Save file
    file_path = os.path.join(UPLOAD_DIR, f"{user_id}_{file.filename}")
    with open(file_path, "wb") as buffer:
        content = file.file.read()
        buffer.write(content)
    
    return file_path, file_type


def create_document_record(
    db: Session,
    filename: str,
    file_type: str,
    file_path: str,
    uploaded_by: int
) -> Document:
    document = Document(
        filename=filename,
        file_type=file_type,
        file_path=file_path,
        uploaded_by=uploaded_by
    )
    db.add(document)
    db.commit()
    db.refresh(document)
    return document


def get_all_documents(db: Session) -> List[Document]:
    return db.query(Document).all()


def get_document_by_id(db: Session, document_id: int) -> Document | None:
    return db.query(Document).filter(Document.id == document_id).first()
