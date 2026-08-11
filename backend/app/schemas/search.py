from pydantic import BaseModel


class SearchRequest(BaseModel):
    query: str


class SearchResult(BaseModel):
    document_id: int
    filename: str
    content: str
    score: float


class SearchResponse(BaseModel):
    query: str
    results: list[SearchResult]
