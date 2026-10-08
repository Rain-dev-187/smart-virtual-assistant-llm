import React, { useState, useRef } from "react";
import { CepiritAvatar, I } from "./ui";

const INITIAL = [
  { role: "user", text: "kalo untuk LLM ada harganya gk" },
  {
    role: "asisten",
    text: "Ada, tapi beda model bisnisnya. Penting dulu dipahami: LLM itu nggak ngirim email — dia cuma nulis isi emailnya. Pengirimannya tetap lewat Gmail API/SMTP yang gratis tadi. Jadi biayanya cuma buat \"otak\" yang nulis teks.\n\nRata-rata LLM API itu bayar per token (satuan teks). Kisaran harganya per 1 juta token, kurang lebih:\n\n• Google Gemini Flash — ada tier gratis yang lumayan gede (1.500 request/hari), berbayarnya sekitar $0,10 input / $0,40 output\n• OpenAI GPT-4o mini — sekitar $0,15 / $0,60",
  },
];

export default function ChatScreen({ onOpenDrawer, onOpenMenu, onToggleChatSide, onOpenProfile, panelOpen = false }) {
  const [messages, setMessages] = useState(INITIAL);
  const [draft, setDraft] = useState("");
  const [menu, setMenu] = useState(null); // {x, y, idx}
  const [replyTo, setReplyTo] = useState(null); // pesan yang dibalas
  const pressTimer = useRef(null);

  const send = () => {
    const text = draft.trim();
    if (!text) return;
    setDraft("");
    setReplyTo(null);
    setMessages((m) => [
      ...m,
      { role: "user", text },
      {
        role: "asisten",
        text: "Oke, aku terima pesanmu: \"" + text + "\". Ini demo UI ya — hubungkan ke backend LLM biar aku bisa jawab beneran.",
      },
    ]);
  };

  /* Buka menu konteks (klik kanan / tahan lama) */
  const openMenu = (clientX, clientY, idx) => {
    const w = 190, h = 148;
    const x = Math.min(clientX, window.innerWidth - w - 12);
    const y = Math.min(clientY, window.innerHeight - h - 12);
    setMenu({ x, y, idx });
  };
  const onContextMenu = (e, idx) => {
    e.preventDefault();
    openMenu(e.clientX, e.clientY, idx);
  };
  const onTouchStart = (e, idx) => {
    const t = e.touches[0];
    pressTimer.current = setTimeout(() => openMenu(t.clientX, t.clientY, idx), 550);
  };
  const onTouchEnd = () => clearTimeout(pressTimer.current);
  const onTouchMove = () => clearTimeout(pressTimer.current);

  const doSalin = () => {
    const m = messages[menu.idx];
    if (m && navigator.clipboard) navigator.clipboard.writeText(m.text).catch(() => {});
    setMenu(null);
  };
  const doHapus = () => {
    setMessages((msgs) => msgs.filter((_, i) => i !== menu.idx));
    setMenu(null);
  };
  const doBalas = () => {
    setReplyTo(messages[menu.idx]);
    setMenu(null);
  };

  const bubbleProps = (idx) => ({
    onContextMenu: (e) => onContextMenu(e, idx),
    onTouchStart: (e) => onTouchStart(e, idx),
    onTouchEnd,
    onTouchMove,
    className: "select-none",
  });

  return (
    <div className="flex flex-col h-full w-full max-w-md md:max-w-3xl mx-auto relative">
      {/* Avatar tengah — overlay transparan (desktop), tidak ikut scroll.
          Sembunyi saat panel kanan terbuka (profil pindah ke sidebar) */}
      <div
        key={panelOpen ? "avatar-hidden" : "avatar-shown"}
        className={`pointer-events-none absolute top-0 inset-x-0 z-10 hidden md:block ${panelOpen ? "xl:hidden" : ""}`}
      >
        <div className="relative flex justify-center pt-3">
          <button onClick={onOpenProfile} aria-label="Lihat profil CEPIRIT" className="pointer-events-auto rounded-full animate-pop-in">
            <CepiritAvatar size={72} />
          </button>
        </div>
      </div>

      {/* Area chat */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 pt-14 pb-32 md:pt-4 md:pb-4 space-y-4" onClick={() => setMenu(null)}>
        <div className="flex justify-end">
          <div
            {...bubbleProps(0)}
            className="bg-accent text-white rounded-3xl rounded-br-lg px-5 py-3 max-w-[85%] text-[17px] whitespace-pre-wrap select-none cursor-pointer"
          >
            {INITIAL[0].text}
          </div>
        </div>

        {messages.slice(1).map((m, i) =>
          m.role === "user" ? (
            <div key={i} className="flex justify-end">
              <div
                {...bubbleProps(i + 1)}
                className="bg-accent text-white rounded-3xl rounded-br-lg px-5 py-3 max-w-[85%] text-[17px] whitespace-pre-wrap select-none cursor-pointer"
              >
                {m.text}
              </div>
            </div>
          ) : (
            <div key={i} className="flex justify-start">
              <div
                {...bubbleProps(i + 1)}
                className="bg-card text-white rounded-3xl rounded-bl-lg px-5 py-4 max-w-[92%] text-[17px] whitespace-pre-wrap leading-relaxed select-none cursor-pointer"
              >
                {m.text}
              </div>
            </div>
          )
        )}

      </div>

      {/* Menu konteks pesan: Balas / Salin / Hapus */}
      {menu && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setMenu(null)} />
          <div
            className="fixed z-50 w-[190px] bg-card2 rounded-2xl py-2 shadow-2xl border border-white/10"
            style={{ left: menu.x, top: menu.y }}
          >
            <div className="px-4 py-1.5 text-[12px] text-gray-500">Hari ini jam {new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}</div>
            <button onClick={doBalas} className="w-full flex items-center gap-3 px-4 py-2.5 text-[15px] text-white hover:bg-white/10">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 17 4 12 9 7" /><path d="M20 18v-2a4 4 0 0 0-4-4H4" /></svg>
              Balas
            </button>
            <button onClick={doSalin} className="w-full flex items-center gap-3 px-4 py-2.5 text-[15px] text-white hover:bg-white/10">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
              Salin
            </button>
            <button onClick={doHapus} className="w-full flex items-center gap-3 px-4 py-2.5 text-[15px] text-red-400 hover:bg-white/10">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
              Hapus
            </button>
          </div>
        </>
      )}

      {/* Input bar — fixed di mobile (tidak ikut scroll), normal di desktop */}
      <div className="fixed bottom-16 inset-x-0 z-10 px-4 pb-3 pt-2 md:static md:z-auto md:shrink-0 md:pb-6 md:inset-auto">
        {replyTo && (
          <div className="mb-2 mx-1 flex items-center gap-3 bg-card2 rounded-2xl px-4 py-2.5 border-l-4 border-accent">
            <div className="flex-1 min-w-0">
              <div className="text-[12px] text-accent font-medium">Membalas pesan</div>
              <div className="text-[13px] text-gray-400 truncate">{replyTo.text}</div>
            </div>
            <button onClick={() => setReplyTo(null)} className="text-gray-500 hover:text-white text-xl leading-none" aria-label="Batalkan balasan">×</button>
          </div>
        )}
        <div className="flex items-center gap-2 bg-card md:bg-transparent md:border md:border-white/15 rounded-full pl-5 pr-2 py-2">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Mau aku bantu yang mana?"
            className="flex-1 bg-transparent outline-none text-[16px] placeholder-gray-500 text-white"
          />
          <button
            onClick={send}
            className="w-11 h-11 rounded-full bg-accent text-white flex items-center justify-center shrink-0"
            aria-label="Kirim"
          >
            {I.send}
          </button>
        </div>
      </div>
    </div>
  );
}
