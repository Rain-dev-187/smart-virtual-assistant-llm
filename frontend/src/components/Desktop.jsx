import React, { useState } from "react";
import { I, CepiritAvatar, SheetHeader } from "./ui";
import Drawer from "./Drawer";

/* ---------- Ikon SVG kecil ---------- */
const sw = { fill: "none", stroke: "currentColor", strokeWidth: 1.9, strokeLinecap: "round", strokeLinejoin: "round" };
const Svg = ({ children, size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...sw}>{children}</svg>
);
const J = {
  checkSquare: <Svg><polyline points="9 11 12 14 22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></Svg>,
  heart: <Svg><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" /></Svg>,
  users: <Svg><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></Svg>,
  dollar: <Svg><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></Svg>,
  briefcase: <Svg><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></Svg>,
  palette: <Svg><circle cx="12" cy="12" r="10" /><circle cx="8.5" cy="10" r="1.2" fill="currentColor" stroke="none" /><circle cx="12" cy="7.5" r="1.2" fill="currentColor" stroke="none" /><circle cx="16" cy="10.5" r="1.2" fill="currentColor" stroke="none" /></Svg>,
  monitor: <Svg><rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></Svg>,
  globe: <Svg><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></Svg>,
  image: <Svg><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></Svg>,
  video: <Svg><polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" /></Svg>,
  mic: <Svg><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" y1="19" x2="12" y2="23" /><line x1="8" y1="23" x2="16" y2="23" /></Svg>,
  folder: <Svg><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" /></Svg>,
  gridBig: <Svg size={44}><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /></Svg>,
};

/* ---------- Rel ikon kiri (desktop) ---------- */
export function IconRail({ view, onView, onToggleChatSide, onOpenSettings, onOpenMenu }) {
  const btn = (active) =>
    `relative w-11 h-11 rounded-2xl flex items-center justify-center transition-colors ${
      active ? "bg-card2 text-white" : "text-gray-500 hover:text-gray-200 hover:bg-card"
    }`;
  const dot = <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-accent" />;
  return (
    <nav className="w-[68px] shrink-0 h-full border-r border-white/10 flex flex-col items-center py-4 gap-1.5 bg-black">
      <div className="mb-3">
        <CepiritAvatar size={40} label={false} />
      </div>
      <button className={btn(view === "chat")} onClick={() => onView("chat")} title="Obrolan">
        {I.chat}
        {view === "chat" && dot}
      </button>
      <button className={btn(false)} onClick={onToggleChatSide} title="Cari percakapan">
        {I.search}
      </button>
      <button className={btn(view === "sasaran")} onClick={() => onView("sasaran")} title="Sasaran">
        {J.checkSquare}
        {view === "sasaran" && dot}
      </button>
      <button className={btn(view === "galeri")} onClick={() => onView("galeri")} title="Galeri">
        {I.plug}
        {view === "galeri" && dot}
      </button>
      <div className="flex-1" />
      <button className={btn(false)} onClick={onOpenSettings} title="Pengaturan">
        {I.gear}
      </button>
      <button className={btn(false)} onClick={onOpenMenu} title="Menu">
        {I.menu}
      </button>
    </nav>
  );
}

/* ---------- Sidebar Galeri (desktop) ---------- */
export const GALERI_LABEL = {
  semua: "Semua artefak",
  dokumen: "Dokumen",
  web: "Artefak web",
  gambar: "Gambar",
  video: "Video",
  podcast: "Podcast",
  file: "File Sistem",
};
const GALERI_NAV = [
  {
    section: "Artefak",
    items: [
      { key: "semua", label: "Semua artefak", icon: I.plug },
      { key: "dokumen", label: "Dokumen", icon: I.doc },
      { key: "web", label: "Artefak web", icon: J.globe },
    ],
  },
  {
    section: "Media",
    items: [
      { key: "gambar", label: "Gambar", icon: J.image },
      { key: "video", label: "Video", icon: J.video },
      { key: "podcast", label: "Podcast", icon: J.mic },
    ],
  },
  {
    section: null,
    items: [{ key: "file", label: "File Sistem", icon: J.folder }],
  },
];

export function GaleriSidebar({ filter, onFilter }) {
  return (
    <div className="w-full h-full bg-black border-r border-white/10 py-4 overflow-y-auto no-scrollbar">
      <div className="px-4 pb-4">
        <div className="flex items-center gap-2 bg-card rounded-full px-4 py-2.5 text-gray-500">
          {I.search}
          <span className="text-[15px]">Cari</span>
        </div>
      </div>
      {GALERI_NAV.map((g, gi) => (
        <div key={gi} className="mb-3 px-2">
          {g.section && <div className="px-3 text-gray-500 text-[14px] mb-1">{g.section}</div>}
          {g.items.map((it) => (
            <button
              key={it.key}
              onClick={() => onFilter(it.key)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-[15px] transition-colors ${
                filter === it.key ? "bg-card2 text-white" : "text-gray-400 hover:text-white hover:bg-card"
              }`}
            >
              <span className="shrink-0">{it.icon}</span>
              {it.label}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}

/* ---------- Konten profil CEPIRIT (dipakai panel kanan & sheet profil) ---------- */
export function ProfilCepirit() {
  const [tab, setTab] = useState(0);
  const tabs = [I.menu, I.shield, I.chat, I.lock];
  return (
    <div className="flex flex-col">
      <div className="flex flex-col items-center">
        <div className="relative">
          <CepiritAvatar size={96} label={false} />
          <span className="absolute bottom-1 right-1 w-8 h-8 rounded-full bg-card2 border-2 border-black flex items-center justify-center text-gray-300">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 3a2.8 2.8 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5z" />
            </svg>
          </span>
        </div>
        <div className="text-xl font-semibold mt-3">CEPIRIT</div>
        <div className="text-gray-400 text-[14px] mt-1.5 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-green-500" />
          Terhubung
        </div>
        <div className="text-gray-600 text-[12px] mt-1">Cepet Lancar Dan Plong</div>
      </div>
      <div className="flex gap-1 mt-6 bg-card rounded-full p-1">
        {tabs.map((ic, i) => (
          <button
            key={i}
            onClick={() => setTab(i)}
            className={`flex-1 h-9 rounded-full flex items-center justify-center transition-colors ${
              tab === i ? "bg-card2 text-white" : "text-gray-500 hover:text-gray-300"
            }`}
          >
            {ic}
          </button>
        ))}
      </div>
      <h3 className="text-[17px] font-semibold mt-6 mb-3">Harian</h3>
      <div className="flex items-center gap-3 bg-card rounded-2xl px-4 py-3.5">
        <span className="w-10 h-10 rounded-full bg-card2 flex items-center justify-center text-red-400 shrink-0">
          {J.heart}
        </span>
        <div>
          <div className="font-medium text-[15px]">Heartbeat</div>
          <div className="text-gray-500 text-[13px]">Setiap 30 menit</div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Panel kanan (desktop, tampilan chat) ---------- */
export function RightPanel({ onClose }) {
  return (
    <aside className="hidden xl:flex w-80 shrink-0 h-full border-l border-white/10 flex-col p-6 overflow-y-auto no-scrollbar bg-black">
      <div className="flex justify-end">
        <button onClick={onClose} className="text-gray-500 hover:text-white text-2xl leading-none" aria-label="Tutup panel">×</button>
      </div>
      <div className="mt-2">
        <ProfilCepirit />
      </div>
    </aside>
  );
}

/* ---------- Halaman Sasaran ---------- */
const KATEGORI = [
  { key: "kesehatan", label: "Kesehatan", icon: J.heart },
  { key: "hubungan", label: "Hubungan", icon: J.users },
  { key: "keuangan", label: "Keuangan", icon: J.dollar },
  { key: "karier", label: "Karier", icon: J.briefcase },
  { key: "minat", label: "Minat", icon: J.palette },
  { key: "produktivitas", label: "Produktivitas", icon: J.monitor },
  { key: "lain", label: "Hal lain", icon: I.check },
];

export function SasaranPage({ goals, onSelectKategori, onDeleteGoal }) {
  return (
    <div className="h-full overflow-y-auto no-scrollbar">
      <div className="max-w-3xl mx-auto px-6 py-8">
        <h1 className="text-[28px] font-bold mb-3">Sasaran</h1>
        <p className="text-gray-400 text-[16px] leading-relaxed mb-8">
          Pilih kategori dan beri tahu saya apa yang Anda inginkan, dan saya akan membuat paket personal yang akan berkembang bersama Anda.
        </p>
        {goals.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-3">Sasaran aktif</h2>
            <div className="space-y-2">
              {goals.map((g) => (
                <div key={g.id} className="flex items-center gap-3 bg-card rounded-2xl px-4 py-3">
                  <span className="text-accent shrink-0">{I.check}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{g.teks}</div>
                    <div className="text-gray-500 text-[13px]">{g.kategoriLabel}</div>
                  </div>
                  <button onClick={() => onDeleteGoal(g.id)} className="text-gray-600 hover:text-danger text-xl px-2" aria-label="Hapus sasaran">×</button>
                </div>
              ))}
            </div>
          </div>
        )}
        <h2 className="text-xl font-semibold mb-2">Buat sasaran</h2>
        <div>
          {KATEGORI.map((k) => (
            <button
              key={k.key}
              onClick={() => onSelectKategori(k)}
              className="w-full flex items-center gap-4 px-3 py-3.5 text-left hover:bg-card rounded-2xl transition-colors"
            >
              <span className="text-gray-300 shrink-0">{k.icon}</span>
              <span className="flex-1 text-[17px]">{k.label}</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------- Halaman Galeri / Artefak ---------- */
export function GaleriPage({ artifacts, filterLabel, onCreate, onDelete }) {
  return (
    <div className="h-full overflow-y-auto no-scrollbar">
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-10 flex-wrap gap-3">
          <h1 className="text-[28px] font-bold">{filterLabel}</h1>
          <div className="flex items-center gap-2">
            <button className="bg-card2 text-white rounded-full px-5 py-2.5 text-[15px] font-medium hover:bg-white/10">Pilih</button>
            <button onClick={onCreate} className="bg-accent text-white rounded-full px-5 py-2.5 text-[15px] font-medium hover:opacity-90">
              + Buat artefak
            </button>
          </div>
        </div>
        {artifacts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-gray-600">
            <span className="mb-4 opacity-70">{J.gridBig}</span>
            <p className="text-[16px]">Belum ada artefak</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {artifacts.map((a) => (
              <div key={a.id} className="bg-card rounded-2xl p-5 relative group">
                <button
                  onClick={() => onDelete(a.id)}
                  className="absolute top-3 right-3 text-gray-600 hover:text-danger text-xl opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Hapus artefak"
                >
                  ×
                </button>
                <div className="text-3xl mb-3">{a.emoji}</div>
                <div className="font-medium truncate">{a.nama}</div>
                <div className="text-gray-500 text-[13px] mt-1">{a.tipeLabel}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------- Form buat sasaran (di dalam Sheet) ---------- */
export function SasaranForm({ kategori, onSubmit, onBack }) {
  const [teks, setTeks] = useState("");
  return (
    <div>
      <SheetHeader title={kategori.label} onBack={onBack} />
      <div className="px-5 py-2">
        <p className="text-gray-400 text-[15px] mb-4">
          Tulis sasaran {kategori.label.toLowerCase()} yang ingin Anda capai.
        </p>
        <textarea
          value={teks}
          onChange={(e) => setTeks(e.target.value)}
          rows={3}
          placeholder="Contoh: Lari 5 km tiap pagi"
          className="w-full bg-card2 rounded-2xl p-4 text-white outline-none placeholder-gray-500 text-[16px] resize-none"
        />
        <button
          disabled={!teks.trim()}
          onClick={() => onSubmit(teks.trim())}
          className="mt-4 w-full bg-accent disabled:opacity-40 text-white rounded-full py-3 font-semibold"
        >
          Mulai
        </button>
      </div>
    </div>
  );
}

/* ---------- Form buat artefak (di dalam Sheet) ---------- */
const TIPE_ARTEFAK = [
  { key: "dokumen", label: "Dokumen", emoji: "📄" },
  { key: "web", label: "Artefak web", emoji: "🌐" },
  { key: "gambar", label: "Gambar", emoji: "🖼️" },
  { key: "video", label: "Video", emoji: "🎬" },
  { key: "podcast", label: "Podcast", emoji: "🎙️" },
];
export { TIPE_ARTEFAK };

export function ArtefakForm({ onSubmit, onBack }) {
  const [nama, setNama] = useState("");
  const [tipe, setTipe] = useState("dokumen");
  return (
    <div>
      <SheetHeader title="Buat artefak" onBack={onBack} />
      <div className="px-5 py-2">
        <input
          value={nama}
          onChange={(e) => setNama(e.target.value)}
          placeholder="Nama artefak"
          className="w-full bg-card2 rounded-2xl p-4 text-white outline-none placeholder-gray-500 text-[16px] mb-4"
        />
        <div className="text-gray-400 text-[15px] mb-2">Jenis artefak</div>
        <div className="flex flex-wrap gap-2 mb-2">
          {TIPE_ARTEFAK.map((t) => (
            <button
              key={t.key}
              onClick={() => setTipe(t.key)}
              className={`flex items-center gap-2 rounded-full px-4 py-2.5 text-[15px] transition-colors ${
                tipe === t.key ? "bg-accent text-white" : "bg-card2 text-gray-300"
              }`}
            >
              <span>{t.emoji}</span> {t.label}
            </button>
          ))}
        </div>
        <button
          disabled={!nama.trim()}
          onClick={() => onSubmit(nama.trim(), tipe)}
          className="mt-4 w-full bg-accent disabled:opacity-40 text-white rounded-full py-3 font-semibold"
        >
          Buat
        </button>
      </div>
    </div>
  );
}
