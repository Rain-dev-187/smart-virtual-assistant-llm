import React, { useState } from "react";
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
      {/* Avatar tengah (mobile) — selalu tampil */}
      <div className="md:hidden shrink-0 flex justify-center pt-4">
        <button onClick={onOpenProfile} aria-label="Lihat profil CEPIRIT" className="rounded-full animate-pop-in">
          <CepiritAvatar size={72} />
        </button>
      </div>

      {/* Bar atas desktop — avatar kecil di kiri, klik untuk buka/tutup panel profil.
          Sembunyi saat panel terbuka (profil pindah ke sidebar) */}
      <div
        key={panelOpen ? "avatar-hidden" : "avatar-shown"}
        className={`hidden md:flex shrink-0 items-center px-6 py-3 ${panelOpen ? "xl:hidden" : ""}`}
      >
        <button onClick={onOpenProfile} aria-label="Profil CEPIRIT" className="rounded-full animate-pop-in">
          <CepiritAvatar size={44} label={false} />
        </button>
      </div>

      {/* Area chat */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-4 space-y-4">
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

      </div>

      {/* Input bar */}
      <div className="shrink-0 px-4 pb-3 pt-2">
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
