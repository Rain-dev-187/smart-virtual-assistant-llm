import React, { createContext, useContext, useEffect, useState } from "react";

/* ============================================================
   Sistem avatar VITY
   - Konfigurasi avatar: { body (hex), hat, accessory }
   - Disimpan di backend (PUT /api/avatar/{user}) bila backend aktif,
     selalu dicerminkan ke localStorage supaya tetap jalan offline.
   - Semua VityAvatar tanpa prop config memakai konfigurasi global
     dari AvatarProvider ini.
   ============================================================ */

export const AVATAR_BODY_COLORS = [
  { hex: "#ff9046", nama: "Oranye" },
  { hex: "#4dabff", nama: "Biru" },
  { hex: "#51cf66", nama: "Hijau" },
  { hex: "#b197fc", nama: "Ungu" },
  { hex: "#ff8fa3", nama: "Pink" },
  { hex: "#ffd43b", nama: "Kuning" },
];

export const AVATAR_HATS = [
  { key: "toga", nama: "Toga" },
  { key: "topi", nama: "Topi" },
  { key: "mahkota", nama: "Mahkota" },
  { key: "none", nama: "Tanpa topi" },
];

export const AVATAR_ACCESSORIES = [
  { key: "none", nama: "Tanpa aksesoris" },
  { key: "kacamata", nama: "Kacamata" },
];

export const AVATAR_PRESETS = [
  { key: "klasik", nama: "Klasik", config: { body: "#ff9046", hat: "toga", accessory: "none" } },
  { key: "samudra", nama: "Samudra", config: { body: "#4dabff", hat: "topi", accessory: "none" } },
  { key: "hutan", nama: "Hutan", config: { body: "#51cf66", hat: "none", accessory: "kacamata" } },
  { key: "royal", nama: "Royal", config: { body: "#b197fc", hat: "mahkota", accessory: "none" } },
  { key: "sakura", nama: "Sakura", config: { body: "#ff8fa3", hat: "none", accessory: "none" } },
  { key: "mentari", nama: "Mentari", config: { body: "#ffd43b", hat: "topi", accessory: "kacamata" } },
];

export const DEFAULT_AVATAR = AVATAR_PRESETS[0].config;

const LS_CONFIG = "vity_avatar";
const LS_REQUESTS = "vity_avatar_requests";

export function currentUserId() {
  try {
    return localStorage.getItem("vity_user") || "demo";
  } catch {
    return "demo";
  }
}

/* ---------- Nama tampilan asisten ---------- */
/* Default "VITY"; bisa diubah lewat "Edit nama" di menu pensil profil.
   Disimpan di localStorage dan disiarkan lewat event supaya panel profil
   dan sapaan chat ikut berubah tanpa reload. */
const LS_NAMA = "vity_display_name";
export const NAMA_DEFAULT = "VITY";
export function getDisplayName() {
  try {
    return localStorage.getItem(LS_NAMA) || NAMA_DEFAULT;
  } catch {
    return NAMA_DEFAULT;
  }
}
export function setDisplayName(nama) {
  const bersih = (nama || "").trim() || NAMA_DEFAULT;
  try {
    localStorage.setItem(LS_NAMA, bersih);
  } catch { /* abaikan */ }
  try {
    window.dispatchEvent(new CustomEvent("vity:display-name", { detail: bersih }));
  } catch { /* abaikan */ }
  return bersih;
}
export function teksSapaan(nama) {
  return `Halo! Aku ${nama}, asisten virtual kamu.\n\nAku bisa bantu jawab pertanyaan, jelasin materi, sampai bantu ngerjain tugas. Tanya aja apa yang lagi kamu butuhin.`;
}

function loadLocalConfig() {
  try {
    const raw = localStorage.getItem(LS_CONFIG);
    if (raw) return { ...DEFAULT_AVATAR, ...JSON.parse(raw) };
  } catch { /* abaikan */ }
  return DEFAULT_AVATAR;
}

/* ---------- API client (fallback lokal bila backend mati) ----------
   Default: API relatif (same origin) — Vite memproxy /api ke backend di
   localhost:8000, jadi HP satu WiFi cukup ketik Network URL tanpa .env.
   Isi VITE_API_URL hanya bila backend ada di alamat lain. */
const API_BASE = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
const API_KEY = import.meta.env.VITE_API_KEY || "";

async function apiFetch(path, options) {
  /* Header X-API-Key hanya dikirim bila VITE_API_KEY diisi — pola yang sama
     dengan ChatScreen (issue #20). Endpoint avatar v0.2 tidak mewajibkan
     auth, tapi header ini tidak mengganggu bila backend mengaktifkannya. */
  const headers = { "Content-Type": "application/json" };
  if (API_KEY) headers["X-API-Key"] = API_KEY;
  const res = await fetch(`${API_BASE}${path}`, {
    headers,
    ...options,
  });
  if (!res.ok) throw new Error(`API ${res.status}`);
  return res.json();
}

export const avatarApi = {
  async fetchPresets() {
    return apiFetch("/api/avatar/presets");
  },
  async fetchConfig(userId) {
    const data = await apiFetch(`/api/avatar/${encodeURIComponent(userId)}`);
    return data.config;
  },
  async saveConfig(userId, config) {
    await apiFetch(`/api/avatar/${encodeURIComponent(userId)}`, {
      method: "PUT",
      body: JSON.stringify(config),
    });
  },
  async createRequest(userId, description) {
    return apiFetch(`/api/avatar/requests`, {
      method: "POST",
      body: JSON.stringify({ user_id: userId, description }),
    });
  },
  async listRequests(userId) {
    return apiFetch(`/api/avatar/requests?user_id=${encodeURIComponent(userId)}`);
  },
  /* URL gambar SVG dari backend — bisa dipakai sebagai <img> / dibagikan */
  renderUrl(config, state = "idle") {
    const q = new URLSearchParams({ ...config, state });
    return `${API_BASE}/api/avatar/render?${q.toString()}`;
  },
};

/* ---------- Favicon tab mengikuti avatar ---------- */
/* Ikon kecil di tab browser diganti ke URL gambar avatar (renderUrl),
   jadi ikut berubah tiap avatar diganti. Bila backend mati, href tetap
   ditulis — browser menampilkan ikon terakhir / ikon bawaan. */
function updateFavicon(config) {
  try {
    const href = avatarApi.renderUrl(config);
    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      link.type = "image/svg+xml";
      document.head.appendChild(link);
    }
    if (link.getAttribute("href") !== href) link.setAttribute("href", href);
  } catch { /* abaikan */ }
}

export function loadLocalRequests() {
  try {
    return JSON.parse(localStorage.getItem(LS_REQUESTS) || "[]");
  } catch {
    return [];
  }
}

export function saveLocalRequest(req) {
  const list = [req, ...loadLocalRequests()];
  try { localStorage.setItem(LS_REQUESTS, JSON.stringify(list)); } catch { /* abaikan */ }
  return list;
}

/* ---------- Context global ---------- */

const AvatarCtx = createContext({
  config: DEFAULT_AVATAR,
  setConfig: () => {},
});

export function useAvatar() {
  return useContext(AvatarCtx);
}

export function AvatarProvider({ children }) {
  const [config, setConfigState] = useState(loadLocalConfig);

  /* Sinkron dari backend saat pertama dimuat (bila backend aktif) */
  useEffect(() => {
    let alive = true;
    avatarApi
      .fetchConfig(currentUserId())
      .then((cfg) => {
        if (!alive || !cfg) return;
        const merged = { ...DEFAULT_AVATAR, ...cfg };
        setConfigState(merged);
        try { localStorage.setItem(LS_CONFIG, JSON.stringify(merged)); } catch { /* abaikan */ }
      })
      .catch(() => { /* backend mati — pakai lokal */ });
    return () => { alive = false; };
  }, []);

  const setConfig = (cfg) => {
    const merged = { ...DEFAULT_AVATAR, ...cfg };
    setConfigState(merged);
    try { localStorage.setItem(LS_CONFIG, JSON.stringify(merged)); } catch { /* abaikan */ }
    /* Simpan ke backend juga (best effort) */
    avatarApi.saveConfig(currentUserId(), merged).catch(() => {});
  };

  /* Favicon tab mengikuti config — jalan saat pertama dimuat, tiap
     avatar diganti, dan tiap sinkron dari backend selesai. */
  useEffect(() => {
    updateFavicon(config);
  }, [config]);

  return (
    <AvatarCtx.Provider value={{ config, setConfig }}>
      {children}
    </AvatarCtx.Provider>
  );
}
