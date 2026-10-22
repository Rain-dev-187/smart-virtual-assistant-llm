from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import avatar, chat, health
from app.db.session import engine
from app.models.avatar import Base as AvatarBase

app = FastAPI(title="Smart Virtual Assistant API")

# Tabel fitur avatar dibuat otomatis saat startup (tabel lain menyusul via migrasi).
AvatarBase.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router, prefix="/api")
app.include_router(chat.router, prefix="/api")
app.include_router(avatar.router, prefix="/api")


@app.get("/")
def root():
    return {"status": "ok", "service": "smart-virtual-assistant"}
