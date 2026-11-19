import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    /* Buka akses dari HP (satu WiFi): `npm run dev` langsung menampilkan
       Network URL — HP tinggal ketik URL itu, tanpa .env / IP manual.
       /api diproxy ke backend di localhost:8000, jadi backend cukup jalan
       seperti biasa (tidak perlu --host). */
    host: true,
    proxy: {
      '/api': 'http://localhost:8000',
    },
  },
})
