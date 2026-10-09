# Backend — Smart Virtual Assistant (v0.1 / 10%)

Backend FastAPI tahap awal. Yang sudah jalan:

- `GET /` dan `GET /api/health` — cek status
- `POST /api/chat` — terima `{"message": "..."}`, balas `{"reply": "...", "mode": "stub"|"llm"}`
  - Tanpa `LLM_API_KEY`: mode **stub** (balasan contoh, tanpa biaya API)
  - Dengan `LLM_API_KEY` + `LLM_MODEL`: memanggil LLM lewat klien OpenAI-compatible

## Jalankan lokal (Windows)

```bat
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
copy ..\.env.example ..\.env   :: lalu isi SECRET_KEY (LLM_API_KEY opsional)
uvicorn app.main:app --reload --port 8000
```

Test:

```bat
pytest tests/ -v
```

## Berikutnya (belum dikerjakan)

Auth/JWT, riwayat chat di database (pgvector), integrasi Google Calendar (Sprint 3).
