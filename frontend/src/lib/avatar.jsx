import React, { createContext, useContext, useEffect, useState } from "react";

/* ============================================================
   Sistem avatar CEPIRIT
   - Konfigurasi avatar: { body (hex), hat, accessory }
   - Disimpan di backend (PUT /api/avatar/{user}) bila backend aktif,
     selalu dicerminkan ke localStorage supaya tetap jalan offline.
   - Semua CepiritAvatar tanpa prop config memakai konfigurasi global
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

const LS_CONFIG = "cepirit_avatar";
const LS_REQUESTS = "cepirit_avatar_requests";

export function currentUserId() {
  try {
    return localStorage.getItem("cepirit_user") || "demo";
  } catch {
    return "demo";
  }
}

function loadLocalConfig() {
  try {
    const raw = localStorage.getItem(LS_CONFIG);
    if (raw) return { ...DEFAULT_AVATAR, ...JSON.parse(raw) };
  } catch { /* abaikan */ }
  return DEFAULT_AVATAR;
}

/* ---------- API client (fallback lokal bila backend mati) ---------- */

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

async function apiFetch(path, options) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) throw new Error(`API ${res.status}`);
  return res.json();
}

export const avatarApi = {
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

  return (
    <AvatarCtx.Provider value={{ config, setConfig }}>
      {children}
    </AvatarCtx.Provider>
  );
}
