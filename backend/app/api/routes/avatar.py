"""Endpoint avatar CEPIRIT.

- GET  /api/avatar/presets            daftar preset avatar
- GET  /api/avatar/render             render SVG dari konfigurasi (query params)
- GET  /api/avatar/{user_id}          konfigurasi tersimpan user (default bila belum ada)
- PUT  /api/avatar/{user_id}          simpan konfigurasi avatar user
- POST /api/avatar/requests           kirim permintaan avatar khusus
- GET  /api/avatar/requests?user_id=  daftar permintaan (per user / semua bila kosong)
"""
from fastapi import APIRouter, Depends, HTTPException, Query, Response
from pydantic import ValidationError
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.avatar import AvatarRequest, UserAvatar
from app.schemas.avatar import (
    AvatarConfig,
    AvatarRequestIn,
    AvatarRequestOut,
    PresetOut,
    UserAvatarOut,
)
from app.services.avatar_svg import render_avatar_svg

router = APIRouter(tags=["avatar"])

PRESETS = [
    PresetOut(key="klasik", nama="Klasik",
              config=AvatarConfig(body="#ff9046", hat="toga", accessory="none")),
    PresetOut(key="samudra", nama="Samudra",
              config=AvatarConfig(body="#4dabff", hat="topi", accessory="none")),
    PresetOut(key="hutan", nama="Hutan",
              config=AvatarConfig(body="#51cf66", hat="none", accessory="kacamata")),
    PresetOut(key="royal", nama="Royal",
              config=AvatarConfig(body="#b197fc", hat="mahkota", accessory="none")),
    PresetOut(key="sakura", nama="Sakura",
              config=AvatarConfig(body="#ff8fa3", hat="none", accessory="none")),
    PresetOut(key="mentari", nama="Mentari",
              config=AvatarConfig(body="#ffd43b", hat="topi", accessory="kacamata")),
]

DEFAULT_CONFIG = AvatarConfig()


@router.get("/avatar/presets", response_model=list[PresetOut])
def list_presets():
    return PRESETS


@router.get("/avatar/render")
def render_avatar(
    body: str = "#ff9046",
    hat: str = "toga",
    accessory: str = "none",
    state: str = "idle",
):
    # Validasi lewat skema supaya query liar tidak lolos ke SVG.
    try:
        cfg = AvatarConfig(body=body, hat=hat, accessory=accessory)
    except ValidationError:
        raise HTTPException(status_code=422, detail="Parameter avatar tidak valid")
    svg = render_avatar_svg(cfg.body, cfg.hat, cfg.accessory, state)
    return Response(content=svg, media_type="image/svg+xml")


@router.post("/avatar/requests", response_model=AvatarRequestOut, status_code=201)
def create_request(payload: AvatarRequestIn, db: Session = Depends(get_db)):
    row = AvatarRequest(user_id=payload.user_id, description=payload.description)
    db.add(row)
    db.commit()
    db.refresh(row)
    return row


@router.get("/avatar/requests", response_model=list[AvatarRequestOut])
def list_requests(user_id: str | None = Query(default=None),
                  db: Session = Depends(get_db)):
    q = db.query(AvatarRequest).order_by(AvatarRequest.created_at.desc())
    if user_id:
        q = q.filter(AvatarRequest.user_id == user_id)
    return q.all()


@router.get("/avatar/{user_id}", response_model=UserAvatarOut)
def get_avatar(user_id: str, db: Session = Depends(get_db)):
    row = db.get(UserAvatar, user_id)
    if row is None:
        return UserAvatarOut(user_id=user_id, config=DEFAULT_CONFIG, updated_at=None)
    return UserAvatarOut(user_id=row.user_id, config=AvatarConfig(**row.config),
                         updated_at=row.updated_at)


@router.put("/avatar/{user_id}", response_model=UserAvatarOut)
def save_avatar(user_id: str, config: AvatarConfig, db: Session = Depends(get_db)):
    row = db.get(UserAvatar, user_id)
    data = config.model_dump()
    if row is None:
        row = UserAvatar(user_id=user_id, config=data)
        db.add(row)
    else:
        row.config = data
    db.commit()
    db.refresh(row)
    return UserAvatarOut(user_id=row.user_id, config=AvatarConfig(**row.config),
                         updated_at=row.updated_at)

