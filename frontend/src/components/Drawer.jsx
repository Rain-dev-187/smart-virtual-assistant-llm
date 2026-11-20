import React, { useState, useEffect, useRef } from "react";
import { I } from "./ui";
import { labelWaktuDaftar, urutkanObrolan, obrolanUtama } from "../lib/chats";

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
  chats = [],
  activeChatId = "",
  onSelectChat = () => {},
  onCreateChat = () => {},
  onPinChat = () => {},
  onRenameChat = () => {},
  onArchiveChat = () => {},
  onDeleteChat = () => {},
  onOpenArchived = () => {},
}) {
  const [page, setPage] = useState("main");
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [selinganOpen, setSelinganOpen] = useState(true);
  const [menuChatId, setMenuChatId] = useState(null);
  const [renameId, setRenameId] = useState(null);
  const [renameText, setRenameText] = useState("");
  const renameBatal = useRef(false);

  useEffect(() => {
    if (!open && !asSidebar) {
      setQuery("");
      setMenuOpen(false);
      setMenuChatId(null);
      setRenameId(null);
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
      action: () => {
        if (utama) onSelectChat(utama.id);
        onClose();
      },
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
      action: () => {
        setPage("main");
        setSelinganOpen(true);
      },
    },
  ];

  const q = query.trim().toLowerCase();
  const results = q
    ? conversations.filter((c) => (c.title + " " + c.preview).toLowerCase().includes(q))
    : [];

  /* Daftar selingan yang tampil: yang di-pin dulu, lalu yang terakhir
     aktif; yang diarsipkan tidak tampil di sini. */
  const daftar = urutkanObrolan(chats).filter((c) => !c.archived);
  const diarsip = chats.filter((c) => c.archived);
  const utama = obrolanUtama(chats);

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
              onClick={() => {
                if (utama) onSelectChat(utama.id);
                onClose();
              }}
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

            {/* Obrolan selingan — daftarnya langsung deret ke bawah di
               halaman utama, tiap baris punya menu titik tiga (Pin /
               Rename / Archive / Delete). */}
            <div className="px-5 pt-4 pb-1 flex items-center gap-1 text-gray-400 text-[16px]">
              <button
                onClick={() => setSelinganOpen((o) => !o)}
                className="flex items-center gap-1 text-gray-400 text-[16px] min-w-0"
                aria-label={selinganOpen ? "Sembunyikan obrolan selingan" : "Tampilkan obrolan selingan"}
              >
                <span className="truncate">Obrolan selingan</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" className={`shrink-0 transition-transform ${selinganOpen ? "" : "-rotate-90"}`}>
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
              <span className="flex-1" />
              <button
                onClick={() => {
                  onCreateChat();
                  if (!asSidebar) onClose();
                }}
                className="w-9 h-9 rounded-full hover:bg-card2 flex items-center justify-center text-gray-300 transition-colors shrink-0"
                aria-label="Obrolan baru"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
              </button>
            </div>
            {selinganOpen && (
              <div className="px-2">
                {daftar.length === 0 ? (
                  <div className="px-3 py-4 text-center text-gray-500 text-[15px]">
                    Belum ada obrolan selingan.
                  </div>
                ) : (
                  daftar.map((c) => {
                    const last = c.messages[c.messages.length - 1];
                    const aktif = c.id === activeChatId;
                    const menuBuka = menuChatId === c.id;
                    return (
                      <div
                        key={c.id}
                        className={`relative flex items-center gap-1 px-1 rounded-2xl transition-colors ${aktif ? "bg-card2/60" : "hover:bg-card2/60"}`}
                      >
                        {renameId === c.id ? (
                          <div className="flex-1 flex items-center gap-3 px-2 py-2.5 min-w-0">
                            <span className="w-10 h-10 rounded-full bg-card2 flex items-center justify-center shrink-0 text-gray-300">
                              {I.chat}
                            </span>
                            <input
                              value={renameText}
                              autoFocus
                              onChange={(e) => setRenameText(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  onRenameChat(c.id, renameText);
                                  setRenameId(null);
                                }
                                if (e.key === "Escape") {
                                  renameBatal.current = true;
                                  setRenameId(null);
                                }
                              }}
                              onBlur={() => {
                                if (!renameBatal.current) onRenameChat(c.id, renameText);
                                renameBatal.current = false;
                                setRenameId(null);
                              }}
                              className="flex-1 bg-transparent outline-none border-b border-accent text-white text-[16px] font-medium min-w-0"
                              aria-label="Nama obrolan"
                            />
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setMenuChatId(null);
                              onSelectChat(c.id);
                              if (!asSidebar) onClose();
                            }}
                            className="flex-1 flex items-center gap-3 px-2 py-2.5 rounded-2xl text-left min-w-0"
                          >
                            <span className="w-10 h-10 rounded-full bg-card2 flex items-center justify-center shrink-0 text-gray-300">
                              {I.chat}
                            </span>
                            <span className="flex-1 min-w-0">
                              <span className="flex items-center gap-1.5 text-white text-[16px] font-medium">
                                {c.pinned && (
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" className="shrink-0 text-gray-400">
                                    <rect x="3" y="4" width="18" height="16" rx="2" />
                                    <line x1="9.5" y1="4" x2="9.5" y2="20" />
                                  </svg>
                                )}
                                <span className="truncate">{c.title}</span>
                              </span>
                              <span className="block text-gray-500 text-[14px] truncate">{last ? (last.lampiran ? last.lampiran.nama : last.text) : ""}</span>
                            </span>
                            {last?.waktu ? <span className="text-gray-600 text-[12px] shrink-0">{labelWaktuDaftar(last.waktu)}</span> : null}
                          </button>
                        )}
                        <button
                          onClick={() => setMenuChatId(menuBuka ? null : c.id)}
                          className="w-9 h-9 rounded-full hover:bg-card2 flex items-center justify-center text-gray-400 hover:text-white transition-colors shrink-0"
                          aria-label="Opsi obrolan"
                        >
                          {DOTS_ICON}
                        </button>
                        {menuBuka && (
                          <>
                            <div className="fixed inset-0 z-10 cursor-default" onClick={() => setMenuChatId(null)} />
                            <div className="absolute right-2 top-12 z-20 w-56 bg-card2 rounded-2xl shadow-2xl border border-white/5 overflow-hidden animate-pop-in">
                              <button
                                onClick={() => {
                                  onPinChat(c.id);
                                  setMenuChatId(null);
                                }}
                                className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-white/5 text-left transition-colors"
                              >
                                <span className="text-gray-300 shrink-0">{PIN_ICON}</span>
                                <span className="flex-1 text-[15px] text-white leading-snug">{c.pinned ? "Lepas pin" : "Pin"}</span>
                              </button>
                              <button
                                onClick={() => {
                                  setRenameText(c.title);
                                  setRenameId(c.id);
                                  setMenuChatId(null);
                                }}
                                className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-white/5 text-left transition-colors"
                              >
                                <span className="text-gray-300 shrink-0">
                                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.8 2.8 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5z" /></svg>
                                </span>
                                <span className="flex-1 text-[15px] text-white leading-snug">Rename</span>
                              </button>
                              <button
                                onClick={() => {
                                  onArchiveChat(c.id);
                                  setMenuChatId(null);
                                }}
                                className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-white/5 text-left transition-colors"
                              >
                                <span className="text-gray-300 shrink-0">{ARCHIVE_ICON}</span>
                                <span className="flex-1 text-[15px] text-white leading-snug">Archive</span>
                              </button>
                              <button
                                onClick={() => {
                                  if (window.confirm(`Hapus obrolan "${c.title}"?`)) onDeleteChat(c.id);
                                  setMenuChatId(null);
                                }}
                                className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-white/5 text-left transition-colors"
                              >
                                <span className="text-danger shrink-0">
                                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                                </span>
                                <span className="flex-1 text-[15px] text-danger leading-snug">Delete</span>
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            )}
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
          {diarsip.length === 0 ? (
            <div className="px-3 py-8 text-center text-gray-500 text-[15px]">
              Belum ada obrolan yang diarsipkan.
            </div>
          ) : (
            diarsip.map((a) => {
              const last = a.messages[a.messages.length - 1];
              return (
                <button
                  key={a.id}
                  onClick={() => {
                    onOpenArchived(a.id);
                    if (!asSidebar) onClose();
                  }}
                  className="w-full flex items-center gap-3 px-3 py-3 rounded-2xl hover:bg-card2/60 text-left transition-colors"
                >
                  <span className="w-10 h-10 rounded-full bg-card2 flex items-center justify-center shrink-0 text-gray-300">
                    {I.chat}
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block text-white text-[16px] font-medium truncate">{a.title}</span>
                    <span className="block text-gray-500 text-[14px] truncate">{last ? (last.lampiran ? last.lampiran.nama : last.text) : ""}</span>
                  </span>
                  {last?.waktu ? <span className="text-gray-600 text-[12px] shrink-0">{labelWaktuDaftar(last.waktu)}</span> : null}
                </button>
              );
            })
          )}
        </div>
      </div>
    ) : null;

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
