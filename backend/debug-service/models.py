"""Pydantic models for request/response validation."""
from pydantic import BaseModel
from typing import Optional, Dict

class QueryRequest(BaseModel):
    query: str
    context: Optional[Dict] = {}

class QueryResponse(BaseModel):
    result: str
    metadata: Optional[Dict] = {}
