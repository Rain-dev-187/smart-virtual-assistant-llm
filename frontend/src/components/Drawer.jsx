import React, { useState, useEffect } from "react";
import { I } from "./ui";

const PIN_ICON = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <rect x="3" y="4" width="18" height="16" rx="2" />
    <line x1="9.5" y1="4" x2="9.5" y2="20" />
  </svg>
);
const ARCHIVE_ICON = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <rect x="3" y="4" width="18" height="5" rx="1" />
    <path d="M5 9v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9" />
    <path d="M10 13h4" />
  </svg>
);
const CHECK_ICON = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0a84ff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const DOTS_ICON = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <circle cx="12" cy="5" r="1.7" />
    <circle cx="12" cy="12" r="1.7" />
    <circle cx="12" cy="19" r="1.7" />
  </svg>
);
const BACK_ICON = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const ARCHIVED = [
  { id: "a1", title: "Rencana liburan", preview: "Bantu susun itinerary 3 hari di Bandung", time: "3 hari yang lalu" },
  { id: "a2", title: "Belajar gitar", preview: "Chord dasar untuk pemula", time: "1 minggu yang lalu" },
];

/* ---------- Drawer samping ----------
   asSidebar=true  -> panel statis untuk sidebar desktop (tanpa overlay)
   asSidebar=false -> drawer overlay untuk mobile                            */
export default function Drawer({
  open,
  onClose,
  onOpenSheet,
  asSidebar = false,
  pinned = false,
  onTogglePin = () => {},
}) {
  const [page, setPage] = useState("main");
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!open && !asSidebar) {
      setQuery("");
      setMenuOpen(false);
    }
  }, [open, asSidebar]);

  if (!open && !asSidebar) return null;

  const conversations = [
    {
      id: "utama",
      title: "Obrolan utama",
      preview: "kalo untuk LLM ada harganya gk",
      time: "baru saja",
      wa: false,
      action: () => onClose(),
    },
    {
      id: "wa",
      title: "WhatsApp",
      preview: "Kamu Dzikri, mahasiswa yang lagi belajar MSDM...",
      time: "2 jam yang lalu",
      wa: true,
      action: () => onOpenSheet("saluran"),
    },
    {
      id: "selingan",
      title: "Obrolan selingan",
      preview: "Atur percakapan berdasarkan topik",
      time: "",
      wa: false,
      action: () => setPage("selingan"),
    },
  ];

  const q = query.trim().toLowerCase();
  const results = q
    ? conversations.filter((c) => (c.title + " " + c.preview).toLowerCase().includes(q))
    : [];

  const headerRow = (
    <div className="px-4 pb-3 flex items-center gap-1">
      <div className="flex-1 flex items-center gap-2 bg-card2 rounded-full px-4 py-2.5 text-gray-400 focus-within:text-gray-200 transition-colors min-w-0">
        {I.search}
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari"
          className="flex-1 bg-transparent outline-none text-[16px] placeholder-gray-500 text-white min-w-0"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="text-gray-500 hover:text-white text-xl leading-none shrink-0"
            aria-label="Hapus pencarian"
          >
            ×
          </button>
        )}
      </div>
      <div className="relative shrink-0">
        <button
          onClick={() => setMenuOpen((o) => !o)}
          className="w-10 h-10 rounded-full hover:bg-card2 flex items-center justify-center text-gray-300 transition-colors"
          aria-label="Opsi panel obrolan"
        >
          {DOTS_ICON}
        </button>
        {menuOpen && (
          <>
            <div className="fixed inset-0 z-10 cursor-default" onClick={() => setMenuOpen(false)} />
            <div className="absolute right-0 top-11 z-20 w-72 bg-card2 rounded-2xl shadow-2xl border border-white/5 overflow-hidden animate-pop-in">
              {asSidebar && (
                <button
                  onClick={() => {
                    onTogglePin();
                    setMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-white/5 text-left transition-colors"
                >
                  <span className="text-gray-300 shrink-0">{PIN_ICON}</span>
                  <span className="flex-1 text-[15px] text-white leading-snug">
                    Buat panel obrolan tetap terlihat
                  </span>
                  {pinned && <span className="shrink-0">{CHECK_ICON}</span>}
                </button>
              )}
              <button
                onClick={() => {
                  setPage("arsip");
                  setMenuOpen(false);
                  setQuery("");
                }}
                className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-white/5 text-left transition-colors"
              >
                <span className="text-gray-300 shrink-0">{ARCHIVE_ICON}</span>
                <span className="flex-1 text-[15px] text-white leading-snug">
                  Tampilkan obrolan yang diarsipkan
                </span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );

  const content =
    page === "main" ? (
      <div className="flex-1 overflow-y-auto no-scrollbar py-4">
        {headerRow}

        {q ? (
          /* Hasil pencarian */
          <div className="px-2">
            {results.length === 0 ? (
              <div className="px-3 py-8 text-center text-gray-500 text-[15px]">
                Tidak ada obrolan yang cocok
              </div>
            ) : (
              results.map((r) => (
                <button
                  key={r.id}
                  onClick={r.action}
                  className="w-full flex items-center gap-3 px-3 py-3 rounded-2xl hover:bg-card2/60 text-left transition-colors"
                >
                  <span className="w-10 h-10 rounded-full bg-card2 flex items-center justify-center shrink-0 text-gray-300">
                    {r.wa ? (
                      <span className="w-6 h-6 rounded-full bg-[#25d366] flex items-center justify-center text-white text-[13px]">◉</span>
                    ) : (
                      I.chat
                    )}
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block text-white text-[16px] font-medium truncate">{r.title}</span>
                    <span className="block text-gray-500 text-[14px] truncate">{r.preview}</span>
                  </span>
                  {r.time ? <span className="text-gray-600 text-[12px] shrink-0">{r.time}</span> : null}
                </button>
              ))
            )}
          </div>
        ) : (
          <>
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
          </>
        )}
      </div>
    ) : page === "arsip" ? (
      <div className="flex-1 overflow-y-auto no-scrollbar py-4">
        <div className="px-4 pb-3 flex items-center gap-1">
          <button
            onClick={() => setPage("main")}
            className="w-10 h-10 rounded-full hover:bg-card2 flex items-center justify-center text-gray-300 transition-colors"
            aria-label="Kembali"
          >
            {BACK_ICON}
          </button>
          <span className="text-white text-[17px] font-medium">Obrolan yang diarsipkan</span>
        </div>
        <div className="px-2">
          {ARCHIVED.map((a) => (
            <button
              key={a.id}
              onClick={onClose}
              className="w-full flex items-center gap-3 px-3 py-3 rounded-2xl hover:bg-card2/60 text-left transition-colors"
            >
              <span className="w-10 h-10 rounded-full bg-card2 flex items-center justify-center shrink-0 text-gray-300">
                {I.chat}
              </span>
              <span className="flex-1 min-w-0">
                <span className="block text-white text-[16px] font-medium truncate">{a.title}</span>
                <span className="block text-gray-500 text-[14px] truncate">{a.preview}</span>
              </span>
              <span className="text-gray-600 text-[12px] shrink-0">{a.time}</span>
            </button>
          ))}
        </div>
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
