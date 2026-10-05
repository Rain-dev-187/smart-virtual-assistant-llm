import { useState } from "react";

export default function App() {
  const [status, setStatus] = useState("Belum dicek");

  async function cekBackend() {
    try {
      const res = await fetch("http://localhost:8000/api/health");
      const data = await res.json();
      setStatus("Terhubung: " + JSON.stringify(data));
    } catch (e) {
      setStatus("Gagal terhubung: " + e.message);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center gap-6 p-6">
      <h1 className="text-3xl font-bold">Smart Virtual Assistant</h1>
      <p className="text-slate-400">Asisten produktivitas berbasis LLM (setup awal)</p>
      <button
        onClick={cekBackend}
        className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 font-medium"
      >
        Cek koneksi backend
      </button>
      <p className="text-sm text-slate-400">{status}</p>
    </div>
  );
}
