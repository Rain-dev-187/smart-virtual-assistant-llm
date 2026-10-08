import React, { useState } from "react";
import { SheetHeader, SectionTitle, Progress } from "./ui";

const THEMES = [
  { name: "Krem", bg: "#f5e9d6" },
  { name: "Biru", bg: "#0a84ff" },
  { name: "Biru muda", bg: "#30b0ff" },
  { name: "Ungu", bg: "#a259ff" },
  { name: "Pink", bg: "#ff2d78" },
  { name: "Oranye", bg: "#ff9500" },
  { name: "Hijau", bg: "#30d158" },
];

export default function Umum({ onBack, bare = false }) {
  const [mode, setMode] = useState("otomatis");
  const [theme, setTheme] = useState(0);

  return (
    <div>
      {!bare && <SheetHeader title="Umum" onBack={onBack} />}

      {/* Akun Meta */}
      <div className="mx-4 mt-2 bg-card2 rounded-3xl p-4 flex items-center gap-3">
        <span className="text-2xl text-gray-300">∞</span>
        <div className="flex-1">
          <div className="text-[17px] font-medium">Akun Meta</div>
          <div className="text-gray-400 text-[15px]">Kata sandi, keamanan, detail pribadi</div>
        </div>
        <span className="text-gray-500 text-xl">↗</span>
      </div>

      {/* Penggunaan */}
      <SectionTitle>Penggunaan</SectionTitle>
      <div className="mx-4 bg-card2 rounded-3xl p-5 space-y-6">
        <div>
          <div className="flex justify-between items-start mb-1">
            <div>
              <div className="text-[17px] font-medium">Paket gratis</div>
              <div className="text-gray-400 text-[15px]">Batas mingguan diatur ulang pada 14 Okt</div>
            </div>
            <div className="text-right text-gray-400 text-[15px] leading-tight">
              0%<br />digunakan
            </div>
          </div>
          <Progress value={0} />
        </div>
        <div>
          <div className="flex justify-between items-start mb-1">
            <div>
              <div className="text-[17px] font-medium">Token tambahan</div>
              <div className="text-gray-400 text-[15px]">Tidak pernah kedaluwarsa</div>
            </div>
            <div className="text-right text-gray-400 text-[15px] leading-tight">
              0% digunakan (sisa 1 M<br />token)
            </div>
          </div>
          <Progress value={0} />
        </div>
        <button className="text-accent text-[16px]">Upgrade</button>
      </div>

      {/* Bahasa */}
      <div className="mx-4 mt-4 bg-card2 rounded-3xl p-5 flex items-center justify-between">
        <span className="text-[17px]">Bahasa</span>
        <span className="text-gray-500 text-xl">›</span>
      </div>

      {/* Tampilan */}
      <SectionTitle>Tampilan</SectionTitle>
      <div className="mx-4 bg-card2 rounded-3xl p-5 space-y-5">
        <div className="flex items-center justify-between">
          <span className="text-[17px]">Mode</span>
          <div className="flex bg-card rounded-full p-1">
            {[
              ["terang", "☀"],
              ["gelap", "☾"],
              ["otomatis", "🖥"],
            ].map(([k, emo]) => (
              <button
                key={k}
                onClick={() => setMode(k)}
                className={`w-11 h-9 rounded-full flex items-center justify-center text-lg ${mode === k ? "bg-card2" : ""}`}
                aria-label={k}
              >
                {emo}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[17px]">Warna tema</span>
          <div className="flex gap-2.5">
            {THEMES.map((t, i) => (
              <button
                key={t.name}
                onClick={() => setTheme(i)}
                className="w-9 h-9 rounded-full flex items-center justify-center"
                style={{ background: t.bg }}
                aria-label={t.name}
              >
                {theme === i && <span className="text-black text-sm">✓</span>}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
