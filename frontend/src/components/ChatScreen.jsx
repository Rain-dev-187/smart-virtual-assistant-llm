import React, { useState } from "react";
import { MuseAvatar, I } from "./ui";

const INITIAL = [
  { role: "user", text: "kalo untuk LLM ada harganya gk" },
  {
    role: "asisten",
    text: "Ada, tapi beda model bisnisnya. Penting dulu dipahami: LLM itu nggak ngirim email — dia cuma nulis isi emailnya. Pengirimannya tetap lewat Gmail API/SMTP yang gratis tadi. Jadi biayanya cuma buat \"otak\" yang nulis teks.\n\nRata-rata LLM API itu bayar per token (satuan teks). Kisaran harganya per 1 juta token, kurang lebih:\n\n• Google Gemini Flash — ada tier gratis yang lumayan gede (1.500 request/hari), berbayarnya sekitar $0,10 input / $0,40 output\n• OpenAI GPT-4o mini — sekitar $0,15 / $0,60",
  },
];

export default function ChatScreen({ onOpenDrawer, onOpenMenu }) {
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
    <div className="flex flex-col h-full">
      {/* Status bar tiruan */}
      <div className="flex items-center justify-between px-6 pt-3 text-[13px] font-semibold shrink-0">
        <span>11:31</span>
        <span className="flex items-center gap-1.5 text-gray-300">
          <span className="text-[11px]">📶 📶</span>
          <span>📡</span>
          <span className="bg-gray-700 rounded-md px-1.5 py-0.5 text-[11px]">77</span>
        </span>
      </div>

      {/* Header browser */}
      <div className="flex items-center gap-3 px-4 py-2.5 shrink-0 border-b border-white/5">
        <button className="text-white" aria-label="Beranda">{I.home}</button>
        <div className="flex-1 flex items-center gap-2 bg-card rounded-full px-4 py-2.5 text-gray-300">
          <span className="text-gray-500">⛓</span>
          <span className="text-[15px]">muse.ai</span>
        </div>
        <button className="text-white text-3xl leading-none" aria-label="Tab baru">+</button>
        <button className="relative text-white" aria-label="Tab">
          <span className="block w-8 h-8 rounded-lg border-2 border-gray-500 items-center justify-center flex text-[13px] font-bold">12</span>
        </button>
        <button onClick={onOpenMenu} className="text-white text-2xl leading-none px-1" aria-label="Menu">⋮</button>
      </div>

      {/* Area chat */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-4 space-y-4 relative">
        <div className="flex justify-center">
          <MuseAvatar size={72} />
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

        {/* Tombol Undang melayang */}
        <div className="sticky bottom-2 flex justify-end pr-1">
          <button className="flex items-center gap-2 bg-card2 text-white rounded-full pl-4 pr-5 py-2.5 shadow-lg text-[16px] font-medium">
            {I.gift} Undang
          </button>
        </div>
      </div>

      {/* Input bar */}
      <div className="shrink-0 px-4 pb-5 pt-2 relative">
        <button
          onClick={onOpenDrawer}
          className="absolute -top-2 left-4 w-14 h-14 rounded-full bg-card2 flex items-center justify-center text-white shadow-lg"
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
