import React, { useState } from "react";
import { SheetHeader, Toggle } from "./ui";

/* Wiring backend issue #24: Kontrol data -> API riwayat chat.
   - API_URL default relatif (same origin); Vite memproxy /api ke backend
     di localhost:8000. Override lewat VITE_API_URL bila backend di alamat lain.
   - session_id dibaca dari localStorage key yang sama dengan ChatScreen
     ("vity_session_id") supaya riwayat yang diunduh/dihapus adalah
     sesi yang sama dengan yang dipakai mengobrol.
   - Header X-API-Key hanya dikirim bila VITE_API_KEY diisi (backend
     mengaktifkan auth hanya bila API_KEY di .env backend terisi).
   - Toggle "Bantu sempurnakan model AI" tetap lokal: tidak ada endpoint
     backend untuk itu. "Impor memori" juga belum disambungkan (tidak ada
     endpoint impor di backend). */
const API_URL = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
const API_KEY = import.meta.env.VITE_API_KEY || "";
const SESSION_KEY = "vity_session_id";

const getSessionId = () => {
  try {
    return localStorage.getItem(SESSION_KEY) || "";
  } catch {
    return "";
  }
};

const apiHeaders = () => {
  const headers = { "Content-Type": "application/json" };
  if (API_KEY) headers["X-API-Key"] = API_KEY;
  return headers;
};

export default function KontrolData({ onBack, bare = false }) {
  const [bantu, setBantu] = useState(true);
  const [busy, setBusy] = useState(null); // null | "unduh" | "reset"
  const [status, setStatus] = useState(null); // { kind: "ok" | "error" | "info", text }

  /* Unduh riwayat chat sesi ini sebagai file JSON */
  const unduhData = async () => {
    const sessionId = getSessionId();
    if (!sessionId) {
      setStatus({ kind: "info", text: "Belum ada data obrolan untuk diunduh — kirim pesan di Chat dulu." });
      return;
    }
    setBusy("unduh");
    setStatus(null);
    try {
      const res = await fetch(`${API_URL}/api/chat/history/${encodeURIComponent(sessionId)}`, {
        headers: apiHeaders(),
      });
      if (!res.ok) {
        throw new Error(res.status === 401 ? "unauthorized" : `http-${res.status}`);
      }
      const data = await res.json();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `vity-data-${sessionId}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      const jumlah = Array.isArray(data.messages) ? data.messages.length : 0;
      setStatus({ kind: "ok", text: `Data obrolan berhasil diunduh (${jumlah} pesan).` });
    } catch (err) {
      setStatus({
        kind: "error",
        text:
          err && err.message === "unauthorized"
            ? "Gagal: API key ditolak backend (401). Cek VITE_API_KEY di .env frontend, lalu coba lagi."
            : "Gagal mengunduh data. Pastikan backend jalan (uvicorn app.main:app --reload --port 8000), lalu coba lagi.",
      });
    } finally {
      setBusy(null);
    }
  };

  /* Hapus riwayat chat sesi ini di backend (minta konfirmasi dulu) */
  const aturUlang = async () => {
    const sessionId = getSessionId();
    if (!sessionId) {
      setStatus({ kind: "info", text: "Belum ada riwayat obrolan untuk dihapus." });
      return;
    }
    if (!window.confirm("Hapus seluruh riwayat obrolan VITY secara permanen?")) return;
    setBusy("reset");
    setStatus(null);
    try {
      const res = await fetch(`${API_URL}/api/chat/history/${encodeURIComponent(sessionId)}`, {
        method: "DELETE",
        headers: apiHeaders(),
      });
      if (!res.ok) {
        throw new Error(res.status === 401 ? "unauthorized" : `http-${res.status}`);
      }
      const data = await res.json();
      /* Sesi sudah dihapus di backend; buang juga session_id lokal supaya
         obrolan berikutnya mulai sesi baru yang bersih. */
      try {
        localStorage.removeItem(SESSION_KEY);
      } catch { /* abaikan */ }
      setStatus({
        kind: "ok",
        text: data.deleted === false
          ? "Riwayat sudah kosong — tidak ada yang dihapus."
          : "Riwayat obrolan berhasil dihapus.",
      });
    } catch (err) {
      setStatus({
        kind: "error",
        text:
          err && err.message === "unauthorized"
            ? "Gagal: API key ditolak backend (401). Cek VITE_API_KEY di .env frontend, lalu coba lagi."
            : "Gagal menghapus riwayat. Pastikan backend jalan (uvicorn app.main:app --reload --port 8000), lalu coba lagi.",
      });
    } finally {
      setBusy(null);
    }
  };

  return (
    <div>
      {!bare && <SheetHeader title="Kontrol data" onBack={onBack} />}

      <div className="mx-4 mt-2 bg-card2 rounded-3xl p-5 flex gap-4">
        <span className="text-gray-300 text-2xl shrink-0">🛡</span>
        <div>
          <div className="text-[17px] font-medium">Privasi Anda penting bagi kami</div>
          <p className="text-gray-400 text-[15px] mt-1 leading-relaxed">
            Pelajari tentang langkah-langkah yang kami ambil untuk menjaga informasi Anda tetap privat dan aman.
          </p>
          <button className="text-accent text-[16px] mt-1">Pelajari selengkapnya</button>
        </div>
      </div>

      <div className="mx-4 mt-4 bg-card2 rounded-3xl p-5 flex items-center justify-between gap-4">
        <span className="text-[17px]">Bantu sempurnakan model AI kami</span>
        <Toggle checked={bantu} onChange={setBantu} />
      </div>
      <p className="px-5 mt-2 text-gray-400 text-[14px] leading-relaxed">
        Izinkan kami menggunakan interaksi Anda dengan VITY untuk mengembangkan dan menyempurnakan AI di Meta.
      </p>

      <div className="mx-4 mt-4 bg-card2 rounded-3xl divide-y divide-white/5">
        <button className="w-full flex items-center justify-between p-5 text-[17px]">
          Impor memori
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2.2" strokeLinecap="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
        <button
          onClick={unduhData}
          disabled={busy !== null}
          className="w-full flex items-center justify-between p-5 text-[17px] disabled:opacity-60"
        >
          {busy === "unduh" ? "Mengunduh…" : "Unduh data agen Anda"}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2.2" strokeLinecap="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      <div className="mx-4 mt-4 bg-card2 rounded-3xl p-5">
        <button onClick={aturUlang} disabled={busy !== null} className="text-danger text-[17px] disabled:opacity-60">
          {busy === "reset" ? "Menghapus…" : "Atur ulang VITY"}
        </button>
      </div>
      <p className="px-5 mt-2 text-gray-400 text-[14px] leading-relaxed">
        Menghapus data VITY Anda secara permanen, termasuk riwayat obrolan, file, dan tugas aktif.
      </p>

      {status && (
        <p
          className={`mx-4 mt-3 rounded-2xl px-4 py-3 text-[14px] leading-relaxed ${
            status.kind === "ok"
              ? "bg-green-500/10 text-green-400"
              : status.kind === "error"
                ? "bg-red-500/10 text-red-400"
                : "bg-white/5 text-gray-300"
          }`}
        >
          {status.text}
        </p>
      )}
    </div>
  );
}
