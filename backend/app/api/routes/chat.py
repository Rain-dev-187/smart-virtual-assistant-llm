from fastapi import APIRouter, Depends

from app.api.deps import require_api_key
from app.db import memory as store
from app.schemas.chat import ChatMessage, ChatRequest, ChatResponse, HistoryResponse
from app.services.llm import generate_reply

router = APIRouter()


@router.post("/chat", response_model=ChatResponse)
def chat(req: ChatRequest, _auth: None = Depends(require_api_key)):
    """Kirim pesan. Kirim session_id untuk lanjutkan percakapan yang sama."""
    session_id = store.get_or_create_session(req.session_id)
    store.add_message(session_id, "user", req.message)

    history = [
        {"role": m.role, "content": m.content} for m in store.get_history(session_id)
    ]
    reply, mode = generate_reply(req.message, history=history[:-1])  # tanpa pesan barusan
    store.add_message(session_id, "assistant", reply)

    return ChatResponse(reply=reply, mode=mode, session_id=session_id)


@router.get("/chat/history/{session_id}", response_model=HistoryResponse)
def history(session_id: str, _auth: None = Depends(require_api_key)):
    """Ambil seluruh riwayat percakapan satu sesi."""
    messages = [
        ChatMessage(role=m.role, content=m.content, ts=m.ts)
        for m in store.get_history(session_id)
    ]
    return HistoryResponse(session_id=session_id, messages=messages)


@router.delete("/chat/history/{session_id}")
def delete_history(session_id: str, _auth: None = Depends(require_api_key)):
    """Hapus riwayat satu sesi."""
    found = store.clear_history(session_id)
    return {"session_id": session_id, "deleted": found}
