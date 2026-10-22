"""Skema request/response untuk endpoint avatar."""
from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field, field_validator

HATS = ("toga", "topi", "mahkota", "none")
ACCESSORIES = ("none", "kacamata")


class AvatarConfig(BaseModel):
    body: str = "#ff9046"
    hat: Literal["toga", "topi", "mahkota", "none"] = "toga"
    accessory: Literal["none", "kacamata"] = "none"

    @field_validator("body")
    @classmethod
    def _cek_hex(cls, v: str) -> str:
        v = v.strip().lower()
        if len(v) != 7 or not v.startswith("#"):
            raise ValueError("body harus warna hex, contoh #ff9046")
        int(v[1:], 16)  # ValueError bila bukan hex
        return v


class PresetOut(BaseModel):
    key: str
    nama: str
    config: AvatarConfig


class UserAvatarOut(BaseModel):
    user_id: str
    config: AvatarConfig
    updated_at: datetime | None = None


class AvatarRequestIn(BaseModel):
    user_id: str = Field(min_length=1, max_length=128)
    description: str = Field(min_length=5, max_length=1000)


class AvatarRequestOut(BaseModel):
    id: int
    user_id: str
    description: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True
