# Smart Virtual Assistant — LLM (Frontend UI)

UI web mobile-first yang meniru tampilan aplikasi asisten virtual "Muse" (muse.ai):
dark mode, Bahasa Indonesia, navigasi bottom-sheet & drawer samping.

## Teknologi

- React + Vite
- Tailwind CSS v3 (konfigurasi PostCSS standar)

## Cara menjalankan

```bash
npm install
npm run dev
```

Buka URL yang ditampilkan (biasanya http://localhost:5173).

## Build produksi

```bash
npm run build
```

Hasil build ada di folder `dist/`.

## Struktur

- `src/App.jsx` — router berbasis state (tanpa react-router)
- `src/components/ChatScreen.jsx` — layar "Obrolan utama"
- `src/components/Drawer.jsx` — menu samping (Cari, Saluran, Obrolan selingan)
- `src/components/SettingsMenu.jsx` — daftar Pengaturan
- `src/components/Umum.jsx` — Akun Meta, Penggunaan, Bahasa, Tampilan
- `src/components/Konektor.jsx` — tab Available/Connected + kategori layanan
- `src/components/Izin.jsx` — izin tindakan, akses web, jaringan lanjutan
- `src/components/KontrolData.jsx` — privasi, impor memori, reset
- `src/components/SmallScreens.jsx` — Dompet, Saluran, Bantuan, Info hukum, Artefak, Perangkat
- `src/components/ui.jsx` — komponen bersama (Sheet, Toggle, ikon SVG, dsb.)
