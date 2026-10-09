"""Skema request/response untuk endpoint chat."""
from pydantic import BaseModel, Field


class ChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=4000)


class ChatResponse(BaseModel):
    reply: str
    mode: str  # "stub" (tanpa LLM) atau "llm"
