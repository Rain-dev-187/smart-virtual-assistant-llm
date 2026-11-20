import React, { useState } from "react";
import { SheetHeader, SectionTitle, Progress } from "./ui";
import { getTheme, setTheme, warnaTerang } from "../lib/theme";

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
  /* Warna tema tersimpan (bukan cuma centang): langsung mengubah aksen chat. */
  const [theme, setThemeState] = useState(() => {
    const i = THEMES.findIndex((t) => t.bg.toLowerCase() === getTheme().toLowerCase());
    return i >= 0 ? i : 1; // default Biru
  });
  const pilihTema = (i) => {
    setThemeState(i);
    setTheme(THEMES[i].bg);
  };

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
          <div className="flex justify-between items-start gap-3 mb-1">
            <div className="min-w-0">
              <div className="text-[17px] font-medium">Paket gratis</div>
              <div className="text-gray-400 text-[15px]">Batas mingguan diatur ulang pada 14 Okt</div>
            </div>
            <div className="text-right text-gray-400 text-[15px] leading-tight shrink-0">
              0%<br />digunakan
            </div>
          </div>
          <Progress value={0} />
        </div>
        <div>
          <div className="flex justify-between items-start gap-3 mb-1">
            <div className="min-w-0">
              <div className="text-[17px] font-medium">Token tambahan</div>
              <div className="text-gray-400 text-[15px]">Tidak pernah kedaluwarsa</div>
            </div>
            <div className="text-right text-gray-400 text-[15px] leading-tight shrink-0">
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
        <div className="flex items-center justify-between gap-3">
          <span className="text-[17px] shrink-0">Warna tema</span>
          {/* 7 lingkaran muat di layar sempit: boleh turun ke baris kedua. */}
          <div className="flex flex-wrap justify-end gap-2.5">
            {THEMES.map((t, i) => (
              <button
                key={t.name}
                onClick={() => pilihTema(i)}
                className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                style={{ background: t.bg }}
                aria-label={t.name}
              >
                {theme === i && (
                  <span className="text-sm" style={{ color: warnaTerang(t.bg) ? "#1c1c1e" : "#fff" }}>
                    ✓
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
