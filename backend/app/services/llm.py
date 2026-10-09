"""Lapisan LLM.

Tanpa LLM_API_KEY (atau LLM_MODEL), generate_reply memakai mode stub
supaya frontend bisa dites tanpa keluar biaya API.
"""
from openai import OpenAI

from app.core.config import settings


def _llm_configured() -> bool:
    return bool(settings.llm_api_key) and bool(settings.llm_model)


def generate_reply(message: str) -> tuple[str, str]:
    """Kembalikan (reply, mode). Mode: 'stub' atau 'llm'."""
    if not _llm_configured():
        return (
            "Backend jalan dalam mode stub (LLM_API_KEY belum diisi). "
            f"Pesanmu: {message}",
            "stub",
        )

    client = OpenAI(
        api_key=settings.llm_api_key,
        base_url=settings.llm_base_url or None,
    )
    resp = client.chat.completions.create(
        model=settings.llm_model,
        messages=[
            {
                "role": "system",
                "content": "Kamu asisten virtual yang membantu dan menjawab dengan ringkas.",
            },
            {"role": "user", "content": message},
        ],
        max_tokens=512,
    )
    return (resp.choices[0].message.content or "").strip(), "llm"
