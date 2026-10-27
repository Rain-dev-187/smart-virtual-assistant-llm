"""Penyimpanan riwayat chat sementara (in-memory).

Catatan untuk tim:
- Data hanya tersimpan selama server jalan. Restart server = riwayat hilang.
- Ini sengaja dibuat sederhana supaya bisa dites tanpa Docker/PostgreSQL.
- Route hanya memanggil fungsi-fungsi di file ini, jadi nanti saat pindah ke
  PostgreSQL, cukup ganti isi fungsi di sini — route tidak perlu diubah.
"""
from __future__ import annotations

import time
import uuid
from dataclasses import dataclass, field


@dataclass
class Message:
    role: str  # "user" atau "assistant"
    content: str
    ts: float = field(default_factory=time.time)


# session_id -> daftar pesan, urut dari yang paling lama
_store: dict[str, list[Message]] = {}


def get_or_create_session(session_id: str | None) -> str:
    """Kembalikan session_id yang dipakai. Buat baru kalau kosong/tidak dikenal."""
    if session_id and session_id in _store:
        return session_id
    new_id = uuid.uuid4().hex[:12]
    _store[new_id] = []
    return new_id


def add_message(session_id: str, role: str, content: str) -> None:
    _store.setdefault(session_id, []).append(Message(role=role, content=content))


def get_history(session_id: str) -> list[Message]:
    return list(_store.get(session_id, []))


def clear_history(session_id: str) -> bool:
    """Hapus riwayat satu sesi. Kembalikan True kalau sesi itu ada."""
    return _store.pop(session_id, None) is not None


def reset_store() -> None:
    """Kosongkan semua sesi. Dipakai oleh test supaya tiap test mulai bersih."""
    _store.clear()
