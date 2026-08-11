"""
Reprocess all documents with improved chunking strategy
This will rebuild the vector store with better sentence-aware chunks
"""
from app.core.database import SessionLocal
from app.models.document import Document
from app.services.search_service import process_document_for_search
from app.services.embedding_service import embedding_service
import os

def reprocess_all_documents():
    db = SessionLocal()
    try:
        documents = db.query(Document).all()
        print(f"Found {len(documents)} documents to reprocess")
        
        # Clear existing vector store
        print("Clearing existing vector store...")
        embedding_service.index = None
        embedding_service.metadata = []
        
        # Create new index
        from app.services.embedding_service import VECTOR_STORE_DIR, INDEX_FILE, METADATA_FILE
        import faiss
        import json
        
        embedding_dim = embedding_service.model.get_sentence_embedding_dimension()
        embedding_service.index = faiss.IndexFlatL2(embedding_dim)
        
        # Reprocess each document
        for doc in documents:
            print(f"Processing: {doc.filename}")
            if os.path.exists(doc.file_path):
                file_type = doc.file_type
                process_document_for_search(doc.id, doc.file_path, file_type, doc.filename)
                print(f"  ✓ Processed {doc.filename}")
            else:
                print(f"  ✗ File not found: {doc.file_path}")
        
        print(f"\nReprocessing complete! Vector store now has {embedding_service.index.ntotal} chunks")
        
    except Exception as e:
        print(f"Error during reprocessing: {e}")
        raise
    finally:
        db.close()

if __name__ == "__main__":
    reprocess_all_documents()
