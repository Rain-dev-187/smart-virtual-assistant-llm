import React, { useState, useRef, useEffect } from "react";
import { VityAvatar, I } from "./ui";
import { getDisplayName, teksSapaan } from "../lib/avatar";

/* Sapaan awal: asisten memperkenalkan diri — bukan lagi contoh obrolan
   soal harga LLM. Nama mengikuti "Edit nama" di profil. */
const INITIAL = [
  {
    role: "asisten",
    sapaan: true,
    text: teksSapaan(getDisplayName()),
    waktu: Date.now(),
  },
];

/* Wiring backend issue #20: ChatScreen -> POST /api/chat.
   - API_URL default relatif (same origin); Vite memproxy /api ke backend
     di localhost:8000, jadi HP satu WiFi cukup ketik Network URL.
     Override lewat VITE_API_URL di frontend/.env bila backend di alamat lain.
   - session_id disimpan di localStorage supaya riwayat v0.2 nyambung antar
     kirim; backend mengembalikan session_id baru bila yang dikirim kosong.
   - Header X-API-Key hanya dikirim bila VITE_API_KEY diisi (backend mengaktifkan
     auth hanya bila API_KEY di .env backend terisi; kalau kosong, auth mati). */
const API_URL = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
const API_KEY = import.meta.env.VITE_API_KEY || "";

/* Sesi backend (session_id) sekarang milik tiap obrolan dan diatur App
   lewat props — ChatScreen tidak lagi baca/tulis localStorage sendiri. */

/* ---------- Pemisah hari di chat ----------
   Bukan jam di tiap pesan: hanya satu chip tiap ganti hari, di atas pesan
   pertama hari itu.
   - Dalam seminggu terakhir: nama hari + jam ("Rabu, 09.04").
   - Lebih dari seminggu lalu: nama hari + tanggal ("Rabu, 12 November 2026"). */
function hariYangSama(a, b) {
  const da = new Date(a), db = new Date(b);
  return da.getFullYear() === db.getFullYear() && da.getMonth() === db.getMonth() && da.getDate() === db.getDate();
}
function selisihHari(a, b) {
  const da = new Date(a); da.setHours(0, 0, 0, 0);
  const db = new Date(b); db.setHours(0, 0, 0, 0);
  return Math.round((db - da) / 86400000);
}
function labelPemisahHari(ts) {
  const hari = new Date(ts).toLocaleDateString("id-ID", { weekday: "long" });
  if (selisihHari(ts, Date.now()) <= 7) {
    const jam = new Date(ts).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
    return `${hari}, ${jam}`;
  }
  const tanggal = new Date(ts).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
  return `${hari}, ${tanggal}`;
}

export default function ChatScreen({ onOpenDrawer, onOpenMenu, onToggleChatSide, onOpenProfile, panelOpen = false, chat, sessionId = "", onMessagesChange = () => {}, onSessionIdChange = () => {} }) {
  const [messages, setMessages] = useState(chat?.messages?.length ? chat.messages : INITIAL);
  const [draft, setDraft] = useState("");
  const [menu, setMenu] = useState(null); // {x, y, idx}
  const [replyTo, setReplyTo] = useState(null); // pesan yang dibalas
  const [sending, setSending] = useState(false); // balasan sedang diproses (avatar "working")
  const pressTimer = useRef(null);

  /* Nama tampilan asisten (bisa diubah lewat "Edit nama" di profil):
     dipakai label kutipan balasan + sapaan awal. */
  const [namaAsisten, setNamaAsisten] = useState(getDisplayName());
  useEffect(() => {
    const onNama = (e) => {
      const nama = (e && e.detail) || getDisplayName();
      setNamaAsisten(nama);
      /* Sapaan awal ikut nama baru (selama masih jadi pesan pertama) */
      setMessages((ms) => (ms.length && ms[0].sapaan ? [{ ...ms[0], text: teksSapaan(nama) }, ...ms.slice(1)] : ms));
    };
    window.addEventListener("vity:display-name", onNama);
    return () => window.removeEventListener("vity:display-name", onNama);
  }, []);

  /* Ganti obrolan: muat pesan obrolan itu (sapaan ikut nama terbaru),
     dan bersihkan balasan/menu yang nyangkut dari obrolan sebelumnya. */
  useEffect(() => {
    if (!chat) return;
    setMessages(
      (chat.messages?.length ? chat.messages : INITIAL).map((mm, i) =>
        i === 0 && mm.sapaan ? { ...mm, text: teksSapaan(namaAsisten) } : mm
      )
    );
    setReplyTo(null);
    setMenu(null);
    setPicker(null);
  }, [chat?.id]);

  /* Tiap pesan berubah, simpan ke obrolan aktif (judul otomatis ikut). */
  useEffect(() => {
    onMessagesChange(messages);
  }, [messages]);

  const send = async () => {
    const text = draft.trim();
    if (!text || sending) return;
    /* Kutipan balasan ikut tersimpan di pesan yang dikirim — jadi setelah
       balasan asisten muncul pun, bubble ini tetap menunjukkan pesan apa
       yang dibalas (bukan cuma pratinjau di atas kolom ketik). Disimpan
       sebagai salinan teks, jadi tetap ada walau pesan aslinya dihapus. */
    const quoted = replyTo;
    setDraft("");
    setReplyTo(null);
    setMessages((m) => [...m, { role: "user", text, waktu: Date.now(), replyTo: quoted ? { text: quoted.text, role: quoted.role } : null }]);
    /* Selama progress berjalan avatar beranimasi "working" + indikator mengetik */
    setSending(true);
    try {
      const headers = { "Content-Type": "application/json" };
      if (API_KEY) headers["X-API-Key"] = API_KEY;
      const res = await fetch(`${API_URL}/api/chat`, {
        method: "POST",
        headers,
        body: JSON.stringify({ message: text, session_id: sessionId }),
      });
      if (!res.ok) {
        throw new Error(res.status === 401 ? "unauthorized" : `http-${res.status}`);
      }
      const data = await res.json();
      if (data.session_id) onSessionIdChange(data.session_id);
      setMessages((m) => [
        ...m,
        { role: "asisten", text: data.reply || "(backend tidak mengembalikan balasan)", waktu: Date.now() },
      ]);
    } catch (err) {
      const errText =
        err && err.message === "unauthorized"
          ? "Gagal: API key ditolak backend (401). Cek VITE_API_KEY di .env frontend, lalu refresh halaman."
          : "Gagal menghubungi backend. Pastikan backend jalan (uvicorn app.main:app --reload --port 8000), lalu kirim ulang pesanmu.";
      setMessages((m) => [...m, { role: "asisten", text: errText, waktu: Date.now() }]);
    } finally {
      setSending(false);
    }
  };

  /* Buka menu konteks (klik kanan / tahan lama) */
  const openMenu = (clientX, clientY, idx) => {
    setPicker(null);
    const w = 220, h = 230;
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

  /* Salin teks — navigator.clipboard hanya ada di konteks aman (https /
     localhost), jadi di HP lewat IP LAN (http) clipboard tidak ada dan
     tombol salin diam-diam tidak bekerja. Fallback: textarea sementara +
     execCommand("copy") yang jalan di konteks biasa. */
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);
  const showToast = (text) => {
    setToast(text);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 1800);
  };
  const copyText = async (text) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch { /* lanjut ke fallback */ }
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.top = "0";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      ta.setSelectionRange(0, ta.value.length);
      const ok = document.execCommand("copy");
      document.body.removeChild(ta);
      return ok;
    } catch {
      return false;
    }
  };

  /* Hapus pesan minta konfirmasi dulu (dialog Batal / Hapus). */
  const [confirmHapus, setConfirmHapus] = useState(null); // index pesan atau null

  /* Reaksi emoji ala Muse: satu reaksi per pesan, ketuk emoji yang sama
     untuk melepas. Picker dibuka dari tombol Tanggapi di samping bubble. */
  const EMOJI_REAKSI = ["👍", "❤️", "😂", "😮", "😢", "🙏"];
  const [picker, setPicker] = useState(null); // {x, y, idx} atau null
  const openPicker = (clientX, clientY, idx) => {
    setMenu(null);
    const w = 264, h = 52;
    const x = Math.max(8, Math.min(clientX - w / 2, window.innerWidth - w - 8));
    const y = clientY - h - 12 < 8 ? clientY + 12 : clientY - h - 12;
    setPicker({ x, y, idx });
  };
  const pilihReaksi = (emoji) => {
    if (!picker) return;
    const idx = picker.idx;
    setMessages((ms) => ms.map((mm, i) => (i === idx ? { ...mm, reaction: mm.reaction === emoji ? null : emoji } : mm)));
    setPicker(null);
  };
  const hapusReaksi = (idx) => {
    setMessages((ms) => ms.map((mm, i) => (i === idx ? { ...mm, reaction: null } : mm)));
  };

  const doSalin = async () => {
    const m = messages[menu.idx];
    setMenu(null);
    if (m) showToast((await copyText(m.text)) ? "Pesan disalin" : "Gagal menyalin");
  };
  const doBalas = () => {
    setReplyTo(messages[menu.idx]);
    setMenu(null);
  };
  /* Reaksi dari dalam menu (dipakai tombol titik tiga di HP) */
  const reaksiDariMenu = (emoji) => {
    const idx = menu.idx;
    setMessages((ms) => ms.map((mm, i) => (i === idx ? { ...mm, reaction: mm.reaction === emoji ? null : emoji } : mm)));
    setMenu(null);
  };
  /* Bagikan: lembar berbagi bawaan HP/browser; kalau tidak tersedia
     (misal http IP LAN), fallback salin teks + toast. */
  const doBagikan = async () => {
    const m = messages[menu.idx];
    setMenu(null);
    if (!m) return;
    try {
      if (navigator.share) {
        await navigator.share({ text: m.text });
        return;
      }
    } catch (err) {
      if (err && err.name === "AbortError") return;
      /* lanjut ke fallback */
    }
    showToast((await copyText(m.text)) ? "Teks disalin — tempel untuk membagikan" : "Gagal membagikan");
  };
  const doHapus = () => {
    setConfirmHapus(menu.idx);
    setMenu(null);
  };
  const hapusPesan = () => {
    setMessages((msgs) => msgs.filter((_, i) => i !== confirmHapus));
    setConfirmHapus(null);
  };

  /* Balas / Salin / Hapus langsung dari tombol di samping bubble sendiri. */
  const aksiBalas = (idx) => setReplyTo(messages[idx]);
  const aksiSalin = async (idx) => {
    const m = messages[idx];
    if (m) showToast((await copyText(m.text)) ? "Pesan disalin" : "Gagal menyalin");
  };
  const aksiHapus = (idx) => setConfirmHapus(idx);

  const bubbleProps = (idx) => ({
    onContextMenu: (e) => onContextMenu(e, idx),
    onTouchStart: (e) => onTouchStart(e, idx),
    onTouchEnd,
    onTouchMove,
    className: "select-none",
  });

  /* Titik tiga di bawah bubble — cuma di layar sentuh (HP). Di desktop
     tombol aksi muncul saat bubble di-hover, jadi titik ini disembunyikan. */
  const TombolTitik = ({ idx, className = "mt-1.5" }) => (
    <button
      onClick={(e) => { e.stopPropagation(); openMenu(e.clientX, e.clientY, idx); }}
      title="Opsi pesan"
      aria-label="Opsi pesan"
      className={`hidden [@media(hover:none)]:flex ${className} w-7 h-5 items-center justify-center text-gray-500`}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="1.6" /><circle cx="12" cy="12" r="1.6" /><circle cx="19" cy="12" r="1.6" /></svg>
    </button>
  );

  /* Aksi pesan ala Muse — beda per pengirim:
     - Pesan VITY: Tanggapi (reaksi emoji), Balas, menu ⋯ (Salin / Bagikan).
       Tidak ada Hapus: pesan VITY tidak bisa dihapus.
     - Pesan sendiri: Balas, Salin, Hapus langsung, tanpa titik tiga.
     Di desktop muncul saat bubble di-hover; di layar sentuh disembunyikan
     (diganti titik tiga di bawah bubble). */
  const AksiPesan = ({ idx, isUser }) => (
    <div className="flex items-center gap-0.5 shrink-0 opacity-0 group-hover:opacity-100 [@media(hover:none)]:hidden transition-opacity">
      {!isUser && (
        <button
          onClick={(e) => openPicker(e.clientX, e.clientY, idx)}
          title="Tanggapi"
          aria-label="Tanggapi"
          className="w-8 h-8 rounded-full text-gray-500 hover:text-white hover:bg-white/10 flex items-center justify-center"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M8 14s1.5 2 4 2 4-2 4-2" /><line x1="9" y1="9" x2="9.01" y2="9" /><line x1="15" y1="9" x2="15.01" y2="9" /></svg>
        </button>
      )}
      <button
        onClick={() => aksiBalas(idx)}
        title="Balas"
        aria-label="Balas"
        className="w-8 h-8 rounded-full text-gray-500 hover:text-white hover:bg-white/10 flex items-center justify-center"
      >
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 17 4 12 9 7" /><path d="M20 18v-2a4 4 0 0 0-4-4H4" /></svg>
      </button>
      {isUser ? (
        <>
          <button
            onClick={() => aksiSalin(idx)}
            title="Salin"
            aria-label="Salin"
            className="w-8 h-8 rounded-full text-gray-500 hover:text-white hover:bg-white/10 flex items-center justify-center"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
          </button>
          <button
            onClick={() => aksiHapus(idx)}
            title="Hapus"
            aria-label="Hapus"
            className="w-8 h-8 rounded-full text-gray-500 hover:text-red-400 hover:bg-white/10 flex items-center justify-center"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
          </button>
        </>
      ) : (
        <button
          onClick={(e) => { e.stopPropagation(); openMenu(e.clientX, e.clientY, idx); }}
          title="Lainnya"
          aria-label="Lainnya"
          className="w-8 h-8 rounded-full text-gray-500 hover:text-white hover:bg-white/10 flex items-center justify-center"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="1.6" /><circle cx="12" cy="12" r="1.6" /><circle cx="19" cy="12" r="1.6" /></svg>
        </button>
      )}
    </div>
  );

  return (
    <div className="flex flex-col h-full w-full max-w-md md:max-w-3xl mx-auto relative">
      {/* Avatar tengah — overlay transparan (desktop), tidak ikut scroll.
          Sembunyi saat panel kanan terbuka (profil pindah ke sidebar) */}
      <div
        key={panelOpen ? "avatar-hidden" : "avatar-shown"}
        className={`pointer-events-none absolute top-0 inset-x-0 z-10 ${panelOpen ? "hidden" : "hidden md:block"}`}
      >
        <div className="relative flex justify-center pt-3">
          <button onClick={onOpenProfile} aria-label="Lihat profil VITY" className="pointer-events-auto rounded-full animate-pop-in">
            <VityAvatar size={72} state={sending ? "working" : "idle"} />
          </button>
        </div>
      </div>

      {/* Area chat */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 pt-4 pb-4 space-y-4" onClick={() => setMenu(null)}>
        {messages.map((m, idx) => {
          /* Chip pemisah hari: muncul hanya saat harinya ganti dari pesan
             sebelumnya — bukan jam di tiap pesan. */
          const prev = messages[idx - 1];
          const gantiHari = m.waktu && (!prev || !prev.waktu || !hariYangSama(m.waktu, prev.waktu));
          return (
            <React.Fragment key={idx}>
              {gantiHari && (
                <div className="flex justify-center">
                  <div className="px-3 py-1 rounded-full bg-card2 text-[12px] text-gray-400">
                    {labelPemisahHari(m.waktu)}
                  </div>
                </div>
              )}
              {m.role === "user" ? (
            <div key={idx} className="flex justify-end group">
              <div className="flex flex-col items-end">
                <div className="flex items-center gap-1">
                  <AksiPesan idx={idx} isUser />
                  <div
                    {...bubbleProps(idx)}
                    className="bg-accent text-[var(--vity-on-accent,white)] rounded-3xl rounded-br-lg px-5 py-3 max-w-[85%] text-[17px] whitespace-pre-wrap select-none cursor-pointer"
                  >
                    {m.replyTo && (
                      <div className="mb-1.5 rounded-xl bg-black/20 px-3 py-1.5 text-left">
                        <div className="text-[12px] font-medium text-white/80">
                          {m.replyTo.role === "asisten" ? namaAsisten : "Kamu"}
                        </div>
                        <div className="text-[13px] text-white/70 line-clamp-2 whitespace-pre-wrap break-words">
                          {m.replyTo.text}
                        </div>
                      </div>
                    )}
                    {m.text}
                  </div>
                </div>
                <TombolTitik idx={idx} />
              </div>
            </div>
          ) : (
            <div key={idx} className="flex justify-start group">
              <div className="flex flex-col items-start">
                <div className="flex items-center gap-1">
                  <div
                    {...bubbleProps(idx)}
                    className="relative bg-card text-white rounded-3xl rounded-bl-lg px-5 py-4 max-w-[92%] text-[17px] whitespace-pre-wrap leading-relaxed select-none cursor-pointer"
                  >
                    {m.text}
                    {m.reaction && (
                      <button
                        onClick={() => hapusReaksi(idx)}
                        title="Hapus reaksi"
                        className="absolute -bottom-3 left-3 rounded-full bg-card2 border border-white/10 px-2 py-0.5 text-[13px] leading-none shadow"
                      >
                        {m.reaction}
                      </button>
                    )}
                  </div>
                  <AksiPesan idx={idx} />
                </div>
                <TombolTitik idx={idx} className={m.reaction ? "mt-4" : "mt-1.5"} />
              </div>
            </div>
              )}
            </React.Fragment>
          );
        })}

        {/* Indikator progress: avatar mini lompat-lompat + titik mengetik */}
        {sending && (
          <div className="flex justify-start items-end gap-2">
            <VityAvatar size={34} label={false} state="working" />
            <div className="bg-card rounded-3xl rounded-bl-lg px-5 py-4 flex items-center gap-1.5">
              <span className="typing-dot w-2 h-2 rounded-full bg-gray-300 inline-block" />
              <span className="typing-dot typing-dot-2 w-2 h-2 rounded-full bg-gray-300 inline-block" />
              <span className="typing-dot typing-dot-3 w-2 h-2 rounded-full bg-gray-300 inline-block" />
            </div>
          </div>
        )}

      </div>

      {/* Menu ⋯ / konteks pesan — isi beda per pengirim:
          VITY = reaksi + Balas / Salin / Bagikan, pesan sendiri = Balas / Salin / Hapus.
          Di HP menu ini dibuka dari titik tiga di bawah bubble (satu-satunya
          tombol aksi yang terlihat di layar sentuh). */}
      {menu && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setMenu(null)} />
          <div
            className="fixed z-50 w-[220px] bg-card2 rounded-2xl py-2 shadow-2xl border border-white/10"
            style={{ left: menu.x, top: menu.y }}
          >
            <div className="px-4 py-1.5 text-[12px] text-gray-500">Hari ini jam {new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}</div>
            {messages[menu.idx]?.role === "asisten" && (
              <div className="flex items-center gap-1 px-2 pt-1 pb-2">
                {EMOJI_REAKSI.map((e) => (
                  <button
                    key={e}
                    onClick={() => reaksiDariMenu(e)}
                    className="w-7 h-7 rounded-full text-[17px] hover:bg-white/10 flex items-center justify-center"
                  >
                    {e}
                  </button>
                ))}
              </div>
            )}
            <button onClick={doBalas} className="w-full flex items-center gap-3 px-4 py-2.5 text-[15px] text-white hover:bg-white/10">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 17 4 12 9 7" /><path d="M20 18v-2a4 4 0 0 0-4-4H4" /></svg>
              Balas
            </button>
            <button onClick={doSalin} className="w-full flex items-center gap-3 px-4 py-2.5 text-[15px] text-white hover:bg-white/10">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
              Salin
            </button>
            {messages[menu.idx]?.role === "asisten" && (
              <button onClick={doBagikan} className="w-full flex items-center gap-3 px-4 py-2.5 text-[15px] text-white hover:bg-white/10">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" /></svg>
                Bagikan
              </button>
            )}
            {messages[menu.idx]?.role === "user" && (
              <button onClick={doHapus} className="w-full flex items-center gap-3 px-4 py-2.5 text-[15px] text-red-400 hover:bg-white/10">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                Hapus
              </button>
            )}
          </div>
        </>
      )}

      {/* Picker reaksi emoji */}
      {picker && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setPicker(null)} />
          <div
            className="fixed z-50 flex items-center gap-1 rounded-full bg-card2 border border-white/10 px-2 py-1.5 shadow-2xl"
            style={{ left: picker.x, top: picker.y }}
          >
            {EMOJI_REAKSI.map((e) => (
              <button
                key={e}
                onClick={() => pilihReaksi(e)}
                className="w-9 h-9 rounded-full text-[20px] hover:bg-white/10 flex items-center justify-center"
              >
                {e}
              </button>
            ))}
          </div>
        </>
      )}

      {/* Konfirmasi hapus pesan */}
      {confirmHapus !== null && messages[confirmHapus] && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-6"
          onClick={() => setConfirmHapus(null)}
        >
          <div
            className="bg-card2 rounded-3xl p-5 w-full max-w-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-[17px] font-medium">Hapus pesan?</div>
            <p className="text-gray-400 text-[15px] mt-2 leading-relaxed line-clamp-3">
              {messages[confirmHapus].text}
            </p>
            <div className="flex gap-3 mt-5">
              <button
                onClick={() => setConfirmHapus(null)}
                className="flex-1 py-2.5 rounded-full bg-white/10 text-white text-[15px]"
              >
                Batal
              </button>
              <button
                onClick={hapusPesan}
                className="flex-1 py-2.5 rounded-full bg-danger text-white text-[15px]"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Umpan balik salin/bagikan (toast singkat) */}
      {toast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-white text-black text-[14px] px-4 py-2 rounded-full shadow-xl whitespace-nowrap">
          {toast}
        </div>
      )}

      {/* Input bar — flex child di bawah area chat (tidak ikut scroll).
          Dulu fixed bottom-16: saat toolbar browser HP muncul/hilang atau
          keyboard buka-tutup, posisinya melayang terpisah dari tab bar
          (ruang kosong di bawah) — halaman terasa ngangkat. Sekarang
          menempel langsung di atas tab bar, ikut alur flex. */}
      <div className="shrink-0 px-4 pb-3 pt-2 md:pb-6">
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
            disabled={sending}
            className="w-11 h-11 rounded-full bg-accent text-[var(--vity-on-accent,white)] flex items-center justify-center shrink-0 disabled:opacity-50"
            aria-label="Kirim"
          >
            {I.send}
          </button>
        </div>
      </div>
    </div>
  );
}
