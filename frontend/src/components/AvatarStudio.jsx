import React, { useEffect, useState } from "react";
import { CepiritAvatar, SheetHeader } from "./ui";
import {
  AVATAR_ACCESSORIES,
  AVATAR_BODY_COLORS,
  AVATAR_HATS,
  AVATAR_PRESETS,
  avatarApi,
  currentUserId,
  loadLocalRequests,
  saveLocalRequest,
  useAvatar,
} from "../lib/avatar";

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

/* Bilah progress geser (dipakai saat menyimpan / mengirim) */
function ProgressBar() {
  return (
    <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
      <div className="h-full w-1/3 rounded-full bg-accent progress-slide" />
    </div>
  );
}

function Chip({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-3.5 py-2 rounded-full text-[14px] border transition-colors ${
        active
          ? "bg-accent border-accent text-white"
          : "bg-card2 border-white/10 text-gray-300 hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}

/* ---------- Studio avatar: ganti preset/custom + request avatar khusus ---------- */
export default function AvatarStudio({ onBack }) {
  const { config, setConfig } = useAvatar();
  const [tab, setTab] = useState("ganti"); // ganti | request
  const [draft, setDraft] = useState(config);
  const [testing, setTesting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [desc, setDesc] = useState("");
  const [sending, setSending] = useState(false);
  const [requests, setRequests] = useState(loadLocalRequests);

  /* Muat daftar request dari backend bila aktif */
  useEffect(() => {
    avatarApi
      .listRequests(currentUserId())
      .then((list) => { if (Array.isArray(list) && list.length) setRequests(list); })
      .catch(() => { /* pakai daftar lokal */ });
  }, []);

  const testAnimation = async () => {
    setTesting(true);
    await delay(2200);
    setTesting(false);
  };

  const applyAvatar = async () => {
    setSaving(true);
    /* Simpan ke backend; avatar lompat-lompat selama proses berjalan */
    await Promise.all([
      avatarApi.saveConfig(currentUserId(), draft).catch(() => {}),
      delay(1300),
    ]);
    setConfig(draft);
    setSaving(false);
    setSaved(true);
    await delay(900);
    setSaved(false);
    onBack();
  };

  const submitRequest = async () => {
    const description = desc.trim();
    if (description.length < 5 || sending) return;
    setSending(true);
    let item = null;
    try {
      item = await avatarApi.createRequest(currentUserId(), description);
    } catch {
      item = {
        id: Date.now(),
        description,
        status: "menunggu",
        created_at: new Date().toISOString(),
      };
      saveLocalRequest(item);
    }
    setRequests((r) => [item, ...r]);
    setDesc("");
    setSending(false);
  };

  const working = saving || testing;

  return (
    <div>
      <SheetHeader title="Avatar CEPIRIT" onBack={onBack} />

      {/* Tab */}
      <div className="flex gap-1 mx-4 mt-1 bg-card2 rounded-full p-1">
        {[
          { key: "ganti", label: "Ganti Avatar" },
          { key: "request", label: "Request Avatar" },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex-1 h-9 rounded-full text-[14px] transition-colors ${
              tab === t.key ? "bg-[#171717] text-white" : "text-gray-400"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "ganti" ? (
        <div className="px-5 pt-5">
          {/* Preview besar — beranimasi, lompat saat progress/tes */}
          <div className="flex flex-col items-center">
            <CepiritAvatar size={128} label={false} config={draft} state={working ? "working" : "idle"} />
            {saving ? (
              <div className="w-52 mt-4">
                <ProgressBar />
                <div className="text-center text-[13px] text-gray-400 mt-2">Menyimpan avatar…</div>
              </div>
            ) : saved ? (
              <div className="mt-4 text-green-400 text-[15px]">✓ Avatar dipakai!</div>
            ) : (
              <button
                onClick={testAnimation}
                className="mt-3 text-[13px] text-accent hover:underline"
              >
                Tes animasi progress ▶
              </button>
            )}
          </div>

          {/* Preset */}
          <div className="mt-6 text-[13px] uppercase tracking-wide text-gray-500">Preset</div>
          <div className="grid grid-cols-3 gap-2 mt-2">
            {AVATAR_PRESETS.map((p) => {
              const active = JSON.stringify(p.config) === JSON.stringify(draft);
              return (
                <button
                  key={p.key}
                  onClick={() => setDraft(p.config)}
                  className={`rounded-2xl py-3 flex flex-col items-center gap-1 border transition-colors ${
                    active ? "bg-card2 border-accent" : "bg-card2/50 border-white/5 hover:border-white/20"
                  }`}
                >
                  <CepiritAvatar size={52} label={false} config={p.config} />
                  <span className="text-[13px] text-gray-200">{p.nama}</span>
                </button>
              );
            })}
          </div>

          {/* Warna badan */}
          <div className="mt-6 text-[13px] uppercase tracking-wide text-gray-500">Warna badan</div>
          <div className="flex gap-2.5 mt-2.5">
            {AVATAR_BODY_COLORS.map((c) => (
              <button
                key={c.hex}
                title={c.nama}
                aria-label={`Warna ${c.nama}`}
                onClick={() => setDraft((d) => ({ ...d, body: c.hex }))}
                className={`w-10 h-10 rounded-full border-4 transition-transform ${
                  draft.body === c.hex ? "border-white scale-110" : "border-transparent"
                }`}
                style={{ background: c.hex }}
              />
            ))}
          </div>

          {/* Topi */}
          <div className="mt-6 text-[13px] uppercase tracking-wide text-gray-500">Topi</div>
          <div className="flex flex-wrap gap-2 mt-2.5">
            {AVATAR_HATS.map((h) => (
              <Chip key={h.key} active={draft.hat === h.key} onClick={() => setDraft((d) => ({ ...d, hat: h.key }))}>
                {h.nama}
              </Chip>
            ))}
          </div>

          {/* Aksesoris */}
          <div className="mt-6 text-[13px] uppercase tracking-wide text-gray-500">Aksesoris</div>
          <div className="flex flex-wrap gap-2 mt-2.5">
            {AVATAR_ACCESSORIES.map((a) => (
              <Chip key={a.key} active={draft.accessory === a.key} onClick={() => setDraft((d) => ({ ...d, accessory: a.key }))}>
                {a.nama}
              </Chip>
            ))}
          </div>

          <button
            onClick={applyAvatar}
            disabled={saving}
            className="w-full mt-8 bg-accent text-white rounded-full py-3.5 text-[16px] font-medium disabled:opacity-60"
          >
            {saving ? "Menyimpan…" : "Pakai Avatar Ini"}
          </button>
        </div>
      ) : (
        <div className="px-5 pt-5">
          <div className="flex items-start gap-3">
            <CepiritAvatar size={56} label={false} state={sending ? "working" : "idle"} />
            <p className="text-[14px] text-gray-400 leading-relaxed">
              Mau avatar yang belum ada di preset? Ceritakan maunya kayak apa —
              misalnya warna, topi, atau tema khusus. Request-mu masuk antrean
              dan akan dibuatkan.
            </p>
          </div>

          <textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            rows={4}
            maxLength={1000}
            placeholder="Contoh: avatar pakai hoodie biru, ada headphone, tema gamer…"
            className="w-full mt-4 bg-card2 rounded-2xl px-4 py-3 text-[15px] text-white placeholder-gray-500 outline-none resize-none"
          />
          {sending && (
            <div className="mt-3">
              <ProgressBar />
              <div className="text-[13px] text-gray-400 mt-2">Mengirim request…</div>
            </div>
          )}
          <button
            onClick={submitRequest}
            disabled={sending || desc.trim().length < 5}
            className="w-full mt-4 bg-accent text-white rounded-full py-3.5 text-[16px] font-medium disabled:opacity-50"
          >
            Kirim Request
          </button>

          {/* Daftar request saya */}
          {requests.length > 0 && (
            <>
              <div className="mt-7 text-[13px] uppercase tracking-wide text-gray-500">Request saya</div>
              <div className="mt-2 space-y-2">
                {requests.map((r) => (
                  <div key={r.id} className="bg-card2 rounded-2xl px-4 py-3">
                    <div className="text-[15px] text-white">{r.description}</div>
                    <div className="text-[12px] text-amber-300 mt-1">
                      ● {r.status === "menunggu" ? "Menunggu dibuatkan" : r.status}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
