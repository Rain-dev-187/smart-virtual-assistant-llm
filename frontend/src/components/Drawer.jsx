import React, { useState } from "react";
import { I, CepiritAvatar } from "./ui";

/* ---------- Drawer samping ----------
   asSidebar=true  -> panel statis untuk sidebar desktop (tanpa overlay)
   asSidebar=false -> drawer overlay untuk mobile                            */
export default function Drawer({ open, onClose, onOpenSheet, onNavigate = () => {}, asSidebar = false }) {
  const [page, setPage] = useState("main");

  if (!open && !asSidebar) return null;

  const content =
    page === "main" ? (
      <div className="flex-1 overflow-y-auto no-scrollbar py-4">
        {/* Cari */}
        <div className="px-4 pb-3">
          <div className="flex items-center gap-2 bg-card2 rounded-full px-4 py-2.5 text-gray-400">
            {I.search}
            <span className="text-[16px]">Cari</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full text-left px-5 py-3 text-[17px] text-white bg-card2/60"
        >
          Obrolan utama
        </button>

        {/* Saluran */}
        <div className="px-5 pt-4 pb-1 flex items-center gap-1 text-gray-400 text-[16px]">
          Saluran
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
        <button
          onClick={() => onOpenSheet("saluran")}
          className="w-full flex items-center gap-3 px-5 py-3 text-left"
        >
          <span className="w-8 h-8 rounded-full bg-[#25d366] flex items-center justify-center text-white text-lg">◉</span>
          <span className="text-[17px] text-white">WhatsApp</span>
          <span className="ml-auto w-2.5 h-2.5 rounded-full bg-accent" />
        </button>

        {/* Obrolan selingan */}
        <button
          onClick={() => setPage("selingan")}
          className="w-full flex items-center justify-between px-5 py-3 text-left text-gray-300 text-[17px]"
        >
          Obrolan selingan
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2.2" strokeLinecap="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>

        {/* Jelajah */}
        <div className="px-5 pt-4 pb-1 text-gray-400 text-[16px]">Jelajah</div>
        <button
          onClick={() => onNavigate("sasaran")}
          className="w-full flex items-center gap-3 px-5 py-3 text-left text-gray-300 text-[17px]"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 11 12 14 22 4" />
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
          </svg>
          Sasaran
        </button>
        <button
          onClick={() => onNavigate("galeri")}
          className="w-full flex items-center gap-3 px-5 py-3 text-left text-gray-300 text-[17px]"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" rx="1.5" />
            <rect x="14" y="3" width="7" height="7" rx="1.5" />
            <rect x="14" y="14" width="7" height="7" rx="1.5" />
            <rect x="3" y="14" width="7" height="7" rx="1.5" />
          </svg>
          Galeri
        </button>
      </div>
    ) : (
      <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
        <span className="w-20 h-20 rounded-full bg-card2 flex items-center justify-center text-gray-400 mb-6">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
            <path d="M21 12a8 8 0 0 1-8 8H4l2-3a8 8 0 1 1 15-5z" />
            <circle cx="9" cy="12" r="0.8" fill="currentColor" />
            <circle cx="13" cy="12" r="0.8" fill="currentColor" />
          </svg>
        </span>
        <h3 className="text-xl font-semibold mb-3">Mulai obrolan selingan</h3>
        <p className="text-gray-400 text-[15px] leading-relaxed">
          Obrolan selingan adalah cara opsional untuk mengatur percakapan Anda berdasarkan topik.
        </p>
        <button
          onClick={() => setPage("main")}
          className="mt-8 text-accent text-[16px]"
        >
          Kembali
        </button>
      </div>
    );

  if (asSidebar) {
    return (
      <div className="w-full h-full bg-card flex flex-col overflow-hidden">
        <div className="px-5 pt-5 pb-2 flex items-center gap-2.5 shrink-0">
          <CepiritAvatar size={34} label={false} />
          <div className="flex flex-col leading-tight">
            <span className="text-white font-semibold text-[17px]">CEPIRIT</span>
            <span className="text-gray-500 text-[12px]">Cepet Lancar Dan Plong</span>
          </div>
        </div>
        {content}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="absolute left-0 top-0 bottom-0 w-[78%] max-w-sm bg-card flex flex-col">
        {content}
      </div>
    </div>
  );
}
