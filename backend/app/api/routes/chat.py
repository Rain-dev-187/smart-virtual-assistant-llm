from fastapi import APIRouter

from app.schemas.chat import ChatRequest, ChatResponse
from app.services.llm import generate_reply

router = APIRouter()


@router.post("/chat", response_model=ChatResponse)
def chat(req: ChatRequest):
    reply, mode = generate_reply(req.message)
    return ChatResponse(reply=reply, mode=mode)
