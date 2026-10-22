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

## Fitur avatar CEPIRIT

Avatar bisa diganti user dan dianimasikan. Saat ada progress berjalan
(chat diproses, kode dikirim, avatar disimpan) frontend menampilkan
avatar dalam mode `working` (lompat-lompat + percikan bintang).

- `GET /api/avatar/presets` — 6 preset avatar
- `GET /api/avatar/render?body=%23ff9046&hat=toga&accessory=none&state=idle|working`
  — render konfigurasi jadi gambar SVG beranimasi (untuk preview / dibagikan)
- `GET /api/avatar/{user_id}` — konfigurasi tersimpan user (bawaan bila belum ada)
- `PUT /api/avatar/{user_id}` — simpan konfigurasi `{body, hat, accessory}`
- `POST /api/avatar/requests` — user request avatar khusus `{user_id, description}`
- `GET /api/avatar/requests?user_id=` — daftar request (status: menunggu)

Tabel `user_avatars` & `avatar_requests` dibuat otomatis saat startup.

## Berikutnya (belum dikerjakan)

Auth/JWT, riwayat chat di database (pgvector), integrasi Google Calendar (Sprint 3).
