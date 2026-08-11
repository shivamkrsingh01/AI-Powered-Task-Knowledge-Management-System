import os
import json
import pickle
from typing import List, Dict
from sentence_transformers import SentenceTransformer
import faiss
import numpy as np

VECTOR_STORE_DIR = "vector_store"
INDEX_FILE = os.path.join(VECTOR_STORE_DIR, "faiss.index")
METADATA_FILE = os.path.join(VECTOR_STORE_DIR, "metadata.json")


class EmbeddingService:
    def __init__(self):
        self.model = SentenceTransformer('all-MiniLM-L6-v2')
        self.index = None
        self.metadata: List[Dict] = []
        self._load_or_create_index()
    
    def _load_or_create_index(self):
        os.makedirs(VECTOR_STORE_DIR, exist_ok=True)
        
        if os.path.exists(INDEX_FILE) and os.path.exists(METADATA_FILE):
            # Load existing index
            self.index = faiss.read_index(INDEX_FILE)
            with open(METADATA_FILE, 'r', encoding='utf-8') as f:
                self.metadata = json.load(f)
        else:
            # Create new index
            embedding_dim = self.model.get_sentence_embedding_dimension()
            self.index = faiss.IndexFlatL2(embedding_dim)
            self.metadata = []
    
    def _save_index(self):
        faiss.write_index(self.index, INDEX_FILE)
        with open(METADATA_FILE, 'w', encoding='utf-8') as f:
            json.dump(self.metadata, f, ensure_ascii=False, indent=2)
    
    def generate_embedding(self, text: str) -> np.ndarray:
        return self.model.encode(text, convert_to_numpy=True)
    
    def add_chunks(self, chunks: List[str], document_id: int, filename: str):
        embeddings = self.model.encode(chunks, convert_to_numpy=True)
        
        for i, (chunk, embedding) in enumerate(zip(chunks, embeddings)):
            vector_id = self.index.ntotal
            self.index.add(embedding.reshape(1, -1))
            
            self.metadata.append({
                "vector_id": vector_id,
                "document_id": document_id,
                "filename": filename,
                "chunk_index": i,
                "content": chunk
            })
        
        self._save_index()
    
    def search(self, query: str, k: int = 5) -> List[Dict]:
        if self.index.ntotal == 0:
            return []
        
        query_embedding = self.model.encode([query], convert_to_numpy=True)
        distances, indices = self.index.search(query_embedding, k=k)
        
        results = []
        for distance, idx in zip(distances[0], indices[0]):
            if idx < len(self.metadata):
                metadata = self.metadata[idx]
                # Convert L2 distance to similarity score (0-1)
                similarity = 1 / (1 + distance)
                results.append({
                    "document_id": metadata["document_id"],
                    "filename": metadata["filename"],
                    "content": metadata["content"],
                    "score": float(similarity)
                })
        
        return results


# Global instance
embedding_service = EmbeddingService()
