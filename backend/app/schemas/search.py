from pydantic import BaseModel
from typing import Optional


class SearchRequest(BaseModel):
    query: str
    k: Optional[int] = 10


class SearchResult(BaseModel):
    document_id: int
    filename: str
    content: str
    score: float


class SearchResponse(BaseModel):
    query: str
    results: list[SearchResult]
