from typing import List
from app.services.embedding_service import embedding_service
from app.services.document_service import extract_text, chunk_text


def process_document_for_search(document_id: int, file_path: str, file_type: str, filename: str):
    """Extract text from document, chunk it, and add to vector store"""
    text = extract_text(file_path, file_type)
    chunks = chunk_text(text)
    embedding_service.add_chunks(chunks, document_id, filename)


def search_documents(query: str, k: int = 5) -> List[dict]:
    """Search for relevant document chunks"""
    return embedding_service.search(query, k=k)
