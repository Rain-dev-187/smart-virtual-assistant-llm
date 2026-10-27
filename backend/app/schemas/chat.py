"""Skema request/response untuk endpoint chat."""
from pydantic import BaseModel, Field


class ChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=4000)
    session_id: str | None = None  # kosong = mulai sesi baru


class ChatResponse(BaseModel):
    reply: str
    mode: str  # "stub" (tanpa LLM) atau "llm"
    session_id: str


class ChatMessage(BaseModel):
    role: str  # "user" atau "assistant"
    content: str
    ts: float


class HistoryResponse(BaseModel):
    session_id: str
    messages: list[ChatMessage]
