"""Bagikan gambar: unggah ke Google Drive lalu kembalikan link publik.

Link-nya "anyone with the link can view" (kayak Share di Muse), jadi siapa
pun yang pegang link bisa membuka gambarnya — bukan cuma satu WiFi.

SETUP SEKALI (di laptop, sebelum pertama pakai):
  1. console.cloud.google.com → buat project (atau pakai yang ada)
  2. APIs & Services → Library → cari "Google Drive API" → Enable
  3. IAM & Admin → Service Accounts → Create Service Account → nama bebas
     (mis. vity-share) → Create → lewati pemberian role → Done
  4. Klik service account itu → Keys → Add Key → Create new key → JSON
     → file JSON terunduh
  5. Simpan file itu sebagai backend/service-account.json (sejajar .env),
     lalu `pip install -r requirements.txt` dan restart uvicorn.

File kunci itu TIDAK BOLEH masuk repo (sudah ada di .gitignore). Tanpa
kunci tersebut endpoint ini menjawab 503 — tidak ada file yang terunggah
ke mana pun. Pustaka Google juga diimpor malas di dalam fungsi, jadi
backend tetap jalan walau google-api-python-client belum terpasang.
"""

import io
import os

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile

from app.api.deps import require_api_key

router = APIRouter()

# backend/service-account.json (boleh dioverride lewat env).
KUNCI = os.environ.get(
    "GOOGLE_SERVICE_ACCOUNT_FILE",
    os.path.normpath(
        os.path.join(
            os.path.dirname(__file__), "..", "..", "..", "service-account.json"
        )
    ),
)

BATAS_BYTE = 20 * 1024 * 1024  # 20 MB


@router.post("/share")
async def bagikan(file: UploadFile = File(...), _auth: None = Depends(require_api_key)):
    """Terima satu file gambar, unggah ke Drive, kembalikan link publiknya."""
    try:
        from google.oauth2 import service_account
        from googleapiclient.discovery import build
        from googleapiclient.http import MediaIoBaseUpload
    except ImportError:
        raise HTTPException(
            status_code=503,
            detail="Pustaka Google belum terpasang. Jalankan pip install -r requirements.txt lalu restart backend.",
        )
    if not os.path.exists(KUNCI):
        raise HTTPException(
            status_code=503,
            detail="Google Drive belum disetup. Simpan kunci service account sebagai backend/service-account.json lalu restart backend.",
        )
    data = await file.read()
    if not data:
        raise HTTPException(status_code=400, detail="File kosong.")
    if len(data) > BATAS_BYTE:
        raise HTTPException(status_code=413, detail="File terlalu besar (maks 20 MB).")
    try:
        creds = service_account.Credentials.from_service_account_file(
            KUNCI, scopes=["https://www.googleapis.com/auth/drive.file"]
        )
        drive = build("drive", "v3", credentials=creds)
        media = MediaIoBaseUpload(
            io.BytesIO(data), mimetype=file.content_type or "image/jpeg"
        )
        dibuat = (
            drive.files()
            .create(
                body={"name": file.filename or "gambar"},
                media_body=media,
                fields="id,webViewLink",
            )
            .execute()
        )
        drive.permissions().create(
            fileId=dibuat["id"], body={"type": "anyone", "role": "reader"}
        ).execute()
    except HTTPException:
        raise
    except Exception as e:  # noqa: BLE001 — sengaja ditangkap semua: error Drive apa pun diubah menjadi jawaban 502 yang rapi
        raise HTTPException(status_code=502, detail=f"Gagal mengunggah ke Drive: {e}")
    return {"url": dibuat["webViewLink"]}
