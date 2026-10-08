import React from "react";

/* ---------- Avatar bundar "CEPIRIT" ---------- */
export function CepiritAvatar({ size = 64, label = true }) {
  return (
    <div className="flex flex-col items-center">
      <div
        className="rounded-full bg-[#f5e9d6] flex items-center justify-center overflow-hidden"
        style={{ width: size, height: size }}
      >
        <svg viewBox="0 0 48 48" width={size * 0.72} height={size * 0.72}>
          <ellipse cx="24" cy="20" rx="11" ry="13" fill="#f7efe0" />
          <circle cx="19" cy="19" r="2.2" fill="#333" />
          <circle cx="29" cy="19" r="2.2" fill="#333" />
          <path d="M20 26 Q24 29 28 26" stroke="#333" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        </svg>
      </div>
      {label && (
        <div className="mt-1 bg-card2 text-white text-sm font-medium px-4 py-1 rounded-full">
          CEPIRIT
        </div>
      )}
    </div>
  );
}

/* ---------- Bottom sheet generik (jadi modal tengah di desktop) ---------- */
export function Sheet({ children, onClose, labelled = true }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center md:p-6">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-full max-w-md md:max-w-lg bg-card rounded-t-3xl md:rounded-3xl max-h-[88vh] md:max-h-[85vh] flex flex-col overflow-hidden">
        {labelled && (
          <div className="pt-3 pb-1 flex justify-center shrink-0 md:hidden">
            <div className="w-10 h-1 rounded-full bg-gray-600" />
          </div>
        )}
        <div className="overflow-y-auto no-scrollbar pb-8">{children}</div>
      </div>
    </div>
  );
}

/* ---------- Header sheet dengan tombol back ---------- */
export function SheetHeader({ title, onBack }) {
  return (
    <div className="flex items-center gap-2 px-4 py-3 sticky top-0 bg-card z-10">
      <button
        onClick={onBack}
        className="w-9 h-9 rounded-full bg-card2 flex items-center justify-center text-white"
        aria-label="Kembali"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>
      <h2 className="text-xl font-semibold">{title}</h2>
    </div>
  );
}

/* ---------- Baris menu ---------- */
export function MenuRow({ icon, title, onClick, danger = false, right }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-4 px-5 py-3.5 text-left active:bg-card2"
    >
      <span className={`w-6 h-6 flex items-center justify-center shrink-0 ${danger ? "text-danger" : "text-gray-200"}`}>
        {icon}
      </span>
      <span className={`flex-1 text-[17px] ${danger ? "text-danger" : "text-white"}`}>{title}</span>
      {right ?? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      )}
    </button>
  );
}

/* ---------- Toggle iOS ---------- */
export function Toggle({ checked, onChange }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`w-14 h-8 rounded-full p-1 transition-colors shrink-0 ${checked ? "bg-accent" : "bg-card2"}`}
      role="switch"
      aria-checked={checked}
    >
      <div
        className={`w-6 h-6 bg-white rounded-full shadow transition-transform ${checked ? "translate-x-6" : "translate-x-0"}`}
      />
    </button>
  );
}

/* ---------- Progress bar ---------- */
export function Progress({ value }) {
  return (
    <div className="h-2 rounded-full bg-card2 overflow-hidden">
      <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${value}%` }} />
    </div>
  );
}

/* ---------- Section title ---------- */
export function SectionTitle({ children }) {
  return <h3 className="text-gray-400 text-[17px] font-semibold px-5 mt-6 mb-2">{children}</h3>;
}

/* ---------- Ikon-ikon SVG kecil ---------- */
const p = { fill: "none", stroke: "currentColor", strokeWidth: 1.9, strokeLinecap: "round", strokeLinejoin: "round" };
export const I = {
  home: (
    <svg width="24" height="24" viewBox="0 0 24 24" {...p}>
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 9.5V21h14V9.5" />
    </svg>
  ),
  menu: (
    <svg width="24" height="24" viewBox="0 0 24 24" {...p}>
      <line x1="4" y1="7" x2="20" y2="7" />
      <line x1="4" y1="12" x2="20" y2="12" />
      <line x1="4" y1="17" x2="20" y2="17" />
    </svg>
  ),
  gift: (
    <svg width="18" height="18" viewBox="0 0 24 24" {...p}>
      <rect x="3" y="8" width="18" height="4" />
      <path d="M5 12v9h14v-9M12 8v13M12 8s-1.5-5-4.5-5S4 8 12 8zm0 0s1.5-5 4.5-5S20 8 12 8z" />
    </svg>
  ),
  search: (
    <svg width="22" height="22" viewBox="0 0 24 24" {...p}>
      <circle cx="11" cy="11" r="7" />
      <line x1="16.5" y1="16.5" x2="21" y2="21" />
    </svg>
  ),
  bug: (
    <svg width="22" height="22" viewBox="0 0 24 24" {...p}>
      <ellipse cx="12" cy="13" rx="6" ry="7" />
      <path d="M12 6V3M8 4l1.5 2.5M16 4l-1.5 2.5M4 13h3M17 13h3M6 20l2-2M18 20l-2-2" />
    </svg>
  ),
  gear: (
    <svg width="22" height="22" viewBox="0 0 24 24" {...p}>
      <circle cx="12" cy="12" r="3.2" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1 1.55V21a2 2 0 1 1-4 0v-.09a1.7 1.7 0 0 0-1-1.55 1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-1.55-1H3a2 2 0 1 1 0-4h.09a1.7 1.7 0 0 0 1.55-1 1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.7 1.7 0 0 0 1.87.34h.09a1.7 1.7 0 0 0 1-1.55V3a2 2 0 1 1 4 0v.09a1.7 1.7 0 0 0 1 1.55 1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.7 1.7 0 0 0-.34 1.87v.09a1.7 1.7 0 0 0 1.55 1H21a2 2 0 1 1 0 4h-.09a1.7 1.7 0 0 0-1.55 1z" />
    </svg>
  ),
  plug: (
    <svg width="22" height="22" viewBox="0 0 24 24" {...p}>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  ),
  wallet: (
    <svg width="22" height="22" viewBox="0 0 24 24" {...p}>
      <path d="M3 7a2 2 0 0 1 2-2h13a1 1 0 0 1 1 1v2" />
      <rect x="3" y="7" width="18" height="12" rx="2" />
      <circle cx="16.5" cy="13" r="1.2" fill="currentColor" />
    </svg>
  ),
  shield: (
    <svg width="22" height="22" viewBox="0 0 24 24" {...p}>
      <path d="M12 3l8 3v6c0 4.5-3.2 7.8-8 9-4.8-1.2-8-4.5-8-9V6z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  ),
  lock: (
    <svg width="22" height="22" viewBox="0 0 24 24" {...p}>
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </svg>
  ),
  chat: (
    <svg width="22" height="22" viewBox="0 0 24 24" {...p}>
      <path d="M21 12a8 8 0 0 1-8 8H4l2-3a8 8 0 1 1 15-5z" />
    </svg>
  ),
  device: (
    <svg width="22" height="22" viewBox="0 0 24 24" {...p}>
      <rect x="7" y="2.5" width="10" height="19" rx="2" />
      <rect x="2" y="6" width="10" height="14" rx="2" fill="#1c1c1e" />
    </svg>
  ),
  data: (
    <svg width="22" height="22" viewBox="0 0 24 24" {...p}>
      <rect x="4" y="10" width="16" height="10" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </svg>
  ),
  help: (
    <svg width="22" height="22" viewBox="0 0 24 24" {...p}>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9.5a2.5 2.5 0 1 1 3.8 2.1c-.9.6-1.3 1-1.3 2.1" />
      <circle cx="12" cy="17" r="0.6" fill="currentColor" />
    </svg>
  ),
  doc: (
    <svg width="22" height="22" viewBox="0 0 24 24" {...p}>
      <path d="M6 2h9l5 5v15H6z" />
      <path d="M14 2v6h6" />
    </svg>
  ),
  send: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 19V5m-7 7 7-7 7 7" stroke="currentColor" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  check: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
};

/* ---------- Tile ikon layanan (huruf/emoji) ---------- */
export function ServiceTile({ bg, children, size = 56 }) {
  return (
    <div
      className="rounded-2xl flex items-center justify-center shrink-0 font-bold text-white"
      style={{ width: size, height: size, background: bg, fontSize: size * 0.42 }}
    >
      {children}
    </div>
  );
}
