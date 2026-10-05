# Smart Virtual Assistant (LLM)

Aplikasi web asisten virtual cerdas berbasis *Large Language Model* (LLM) untuk otomatisasi tugas produktivitas: manajemen tugas, penjadwalan dan pengingat, perangkuman teks, penyusunan draf pesan, dan tanya jawab dokumen (RAG).

Penelitian: Program Studi Sistem Informasi, Universitas Kebangsaan Republik Indonesia (2026).

## Teknologi

| Lapisan   | Teknologi                          |
|-----------|------------------------------------|
| Frontend  | React + Vite + Tailwind CSS        |
| Backend   | Python + FastAPI                   |
| Database  | PostgreSQL + pgvector              |
| LLM       | API pihak ketiga (function calling)|
| Integrasi | Google Calendar API + OAuth 2.0    |

## Cara menjalankan (Windows)

### Syarat
- Git
- Docker Desktop (sudah berjalan)

### Langkah
1. Clone repositori ini:
   ```
   git clone https://github.com/Rain-dev-187/smart-virtual-assistant-llm.git
   cd smart-virtual-assistant-llm
   ```
2. Salin `.env.example` menjadi `.env`, lalu isi `LLM_API_KEY` (dan kredensial lain bila sudah ada).
3. Jalankan:
   ```
   docker compose up --build
   ```
4. Buka di browser:
   - Frontend: http://localhost:5173
   - Dokumentasi API: http://localhost:8000/docs
   - Cek kesehatan API: http://localhost:8000/api/health

### Berhenti
```
docker compose down
```

## Struktur proyek

```
smart-virtual-assistant-llm/
├── frontend/            # React + Vite + Tailwind
├── backend/
│   └── app/
│       ├── main.py      # Titik masuk FastAPI
│       ├── core/        # Konfigurasi
│       ├── api/routes/  # Endpoint REST
│       └── db/          # Koneksi database
├── docker-compose.yml   # Orkestrasi db + backend + frontend
└── .env.example         # Contoh variabel lingkungan
```

## Status

Setup awal (Sprint 0): struktur proyek, koneksi dasar frontend–backend, dan database. Fitur menyusul per sprint.
