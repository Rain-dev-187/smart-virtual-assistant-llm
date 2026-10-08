import React, { useState } from "react";
import { CepiritAvatar, I } from "./ui";

const INITIAL = [
  { role: "user", text: "kalo untuk LLM ada harganya gk" },
  {
    role: "asisten",
    text: "Ada, tapi beda model bisnisnya. Penting dulu dipahami: LLM itu nggak ngirim email — dia cuma nulis isi emailnya. Pengirimannya tetap lewat Gmail API/SMTP yang gratis tadi. Jadi biayanya cuma buat \"otak\" yang nulis teks.\n\nRata-rata LLM API itu bayar per token (satuan teks). Kisaran harganya per 1 juta token, kurang lebih:\n\n• Google Gemini Flash — ada tier gratis yang lumayan gede (1.500 request/hari), berbayarnya sekitar $0,10 input / $0,40 output\n• OpenAI GPT-4o mini — sekitar $0,15 / $0,60",
  },
];

export default function ChatScreen({ onOpenDrawer, onOpenMenu, onToggleChatSide }) {
  const [messages, setMessages] = useState(INITIAL);
  const [draft, setDraft] = useState("");

  const send = () => {
    const text = draft.trim();
    if (!text) return;
    setDraft("");
    setMessages((m) => [
      ...m,
      { role: "user", text },
      {
        role: "asisten",
        text: "Oke, aku terima pesanmu: \"" + text + "\". Ini demo UI ya — hubungkan ke backend LLM biar aku bisa jawab beneran.",
      },
    ]);
  };

  return (
    <div className="flex flex-col h-full w-full max-w-md md:max-w-3xl mx-auto">
      {/* Header aplikasi (mobile) */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 shrink-0">
        <div className="flex items-center gap-2.5">
          <CepiritAvatar size={36} label={false} />
          <div className="flex flex-col leading-tight">
            <span className="text-white text-[17px] font-semibold">CEPIRIT</span>
            <span className="text-gray-500 text-[12px]">Cepet Lancar Dan Plong</span>
          </div>
        </div>
        <button onClick={onOpenMenu} className="text-white text-2xl leading-none px-1" aria-label="Menu">⋮</button>
      </div>

      {/* Header desktop ala muse.ai */}
      <div className="hidden md:flex items-center justify-between px-6 py-3 shrink-0">
        <button
          onClick={onToggleChatSide}
          className="flex items-center gap-2 bg-card2 text-white rounded-full px-4 py-2 text-[15px] font-medium hover:bg-white/10 transition-colors"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="4" y1="7" x2="20" y2="7" />
            <line x1="4" y1="12" x2="20" y2="12" />
            <line x1="4" y1="17" x2="20" y2="17" />
          </svg>
          Obrolan
        </button>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 bg-card2 text-white rounded-full pl-4 pr-5 py-2.5 text-[15px] font-medium hover:bg-white/10 transition-colors">
            {I.gift} Undang
          </button>
          <button onClick={onOpenMenu} className="text-white text-2xl leading-none px-2" aria-label="Menu">⋮</button>
        </div>
      </div>

      {/* Area chat */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-4 space-y-4 relative">
        <div className="flex justify-center">
          <CepiritAvatar size={72} />
        </div>

        <div className="flex justify-end">
          <div className="bg-accent text-white rounded-3xl rounded-br-lg px-5 py-3 max-w-[85%] text-[17px] whitespace-pre-wrap">
            {INITIAL[0].text}
          </div>
        </div>

        {messages.slice(1).map((m, i) =>
          m.role === "user" ? (
            <div key={i} className="flex justify-end">
              <div className="bg-accent text-white rounded-3xl rounded-br-lg px-5 py-3 max-w-[85%] text-[17px] whitespace-pre-wrap">
                {m.text}
              </div>
            </div>
          ) : (
            <div key={i} className="flex justify-start">
              <div className="bg-card text-white rounded-3xl rounded-bl-lg px-5 py-4 max-w-[92%] text-[17px] whitespace-pre-wrap leading-relaxed">
                {m.text}
              </div>
            </div>
          )
        )}

        {/* Tombol Undang melayang (mobile saja, di desktop ada di header) */}
        <div className="md:hidden sticky bottom-2 flex justify-end pr-1">
          <button className="flex items-center gap-2 bg-card2 text-white rounded-full pl-4 pr-5 py-2.5 shadow-lg text-[16px] font-medium">
            {I.gift} Undang
          </button>
        </div>
      </div>

      {/* Input bar */}
      <div className="shrink-0 px-4 pb-5 pt-2 relative">
        <button
          onClick={onOpenDrawer}
          className="md:hidden absolute -top-2 left-4 w-14 h-14 rounded-full bg-card2 flex items-center justify-center text-white shadow-lg"
          aria-label="Buka menu"
        >
          {I.menu}
        </button>
        <div className="flex items-center gap-2 bg-card rounded-full pl-5 pr-2 py-2">
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
