"""Model database untuk fitur avatar CEPIRIT.

Dua tabel:
- user_avatars    : konfigurasi avatar pilihan tiap user (satu baris per user)
- avatar_requests : permintaan avatar khusus dari user (antrean untuk diproses)
"""
from datetime import datetime, timezone

from sqlalchemy import JSON, DateTime, Integer, String, Text
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column


class Base(DeclarativeBase):
    pass


def _now():
    return datetime.now(timezone.utc)


class UserAvatar(Base):
    __tablename__ = "user_avatars"

    user_id: Mapped[str] = mapped_column(String(128), primary_key=True)
    config: Mapped[dict] = mapped_column(JSON, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=_now, onupdate=_now
    )


class AvatarRequest(Base):
    __tablename__ = "avatar_requests"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[str] = mapped_column(String(128), index=True)
    description: Mapped[str] = mapped_column(Text)
    status: Mapped[str] = mapped_column(String(32), default="menunggu")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=_now)
