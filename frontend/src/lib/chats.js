import { getDisplayName, teksSapaan } from "./avatar";

/* ---------- Obrolan selingan (multi-chat) ----------
   Daftar obrolan disimpan di localStorage; tiap obrolan punya sesi
   backend sendiri (sessionId) + pesan-pesannya sendiri, jadi bisa
   dibuka lagi besok dan chip pemisah harinya kepakai. */
export const CHATS_KEY = "vity_chats";
export const ACTIVE_CHAT_KEY = "vity_active_chat";
export const SESSION_KEY = "vity_session_id"; // dipakai juga KontrolData

export function buatSapaan() {
  return { role: "asisten", sapaan: true, text: teksSapaan(getDisplayName()), waktu: Date.now() };
}

export function buatObrolanBaru(judul = "Obrolan baru") {
  const now = Date.now();
  return { id: `c${now}`, title: judul, sessionId: "", messages: [buatSapaan()], createdAt: now, updatedAt: now };
}

export function muatObrolan() {
  try {
    const raw = localStorage.getItem(CHATS_KEY);
    if (!raw) return null;
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr) || !arr.length) return null;
    return arr.filter((c) => c && c.id && Array.isArray(c.messages));
  } catch {
    return null;
  }
}

export function simpanObrolan(chats) {
  try {
    localStorage.setItem(CHATS_KEY, JSON.stringify(chats));
  } catch {}
}

/* Obrolan pertama: obrolan yang selama ini dipakai (sesi lamanya ikut). */
export function obrolanAwal() {
  let sessionId = "";
  try {
    sessionId = localStorage.getItem(SESSION_KEY) || "";
  } catch {}
  const c = buatObrolanBaru("Obrolan utama");
  c.sessionId = sessionId;
  return c;
}

/* Judul otomatis dari pesan pertama user (maks 30 karakter). */
export function judulDariPesan(text) {
  const t = (text || "").replace(/\s+/g, " ").trim();
  if (!t) return "Obrolan baru";
  return t.length > 30 ? t.slice(0, 30).trimEnd() + "…" : t;
}

/* Label waktu ringkas buat baris daftar obrolan. */
export function labelWaktuDaftar(ts) {
  if (!ts) return "";
  const d = new Date(ts);
  const now = new Date();
  const samaHari =
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate();
  if (samaHari) return d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
  const seminggu = new Date(now);
  seminggu.setDate(now.getDate() - 7);
  if (d > seminggu) return d.toLocaleDateString("id-ID", { weekday: "long" });
  return d.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}
