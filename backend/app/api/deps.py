"""Dependency autentikasi sederhana: API key lewat header X-API-Key.

Cara pakai: isi API_KEY di file .env, lalu setiap request harus menyertakan
header  X-API-Key: <isi API_KEY>.

Kalau API_KEY di .env masih kosong, auth dimatikan (mode dev) supaya anggota
tim bisa langsung mencoba tanpa setup tambahan.
"""
from fastapi import Header, HTTPException

from app.core.config import settings


def require_api_key(x_api_key: str | None = Header(default=None)) -> None:
    if not settings.api_key:
        return  # mode dev: auth mati
    if x_api_key != settings.api_key:
        raise HTTPException(
            status_code=401,
            detail="API key salah atau hilang. Kirim header X-API-Key.",
        )
