import React, { useState } from "react";
import { SheetHeader, Toggle } from "./ui";

export default function KontrolData({ onBack }) {
  const [bantu, setBantu] = useState(true);

  return (
    <div>
      <SheetHeader title="Kontrol data" onBack={onBack} />

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
        Izinkan kami menggunakan interaksi Anda dengan Muse untuk mengembangkan dan menyempurnakan AI di Meta.
      </p>

      <div className="mx-4 mt-4 bg-card2 rounded-3xl divide-y divide-white/5">
        <button className="w-full flex items-center justify-between p-5 text-[17px]">
          Impor memori
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2.2" strokeLinecap="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
        <button className="w-full flex items-center justify-between p-5 text-[17px]">
          Unduh data agen Anda
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2.2" strokeLinecap="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      <div className="mx-4 mt-4 bg-card2 rounded-3xl p-5">
        <button className="text-danger text-[17px]">Atur ulang Muse</button>
      </div>
      <p className="px-5 mt-2 text-gray-400 text-[14px] leading-relaxed">
        Menghapus data Muse Anda secara permanen, termasuk riwayat obrolan, file, dan tugas aktif.
      </p>
    </div>
  );
}
