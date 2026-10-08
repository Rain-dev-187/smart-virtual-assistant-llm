import React, { useState, useEffect } from "react";
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
export function IconRail({ view, onView, onOpenChatSide, onOpenSearch, onOpenMenu }) {
  const btn = (active) =>
    `relative w-11 h-11 rounded-2xl flex items-center justify-center transition-colors ${
      active ? "bg-card2 text-white" : "text-gray-500 hover:text-gray-200 hover:bg-card"
    }`;
  const dot = <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-accent" />;
  return (
    <nav className="w-[68px] shrink-0 h-full border-r border-white/10 flex flex-col items-center py-4 gap-1.5 bg-[#171717]">
      <div className="mb-3">
        <CepiritAvatar size={40} label={false} />
      </div>
      <button className={btn(view === "chat")} onClick={() => { onView("chat"); onOpenChatSide(); }} title="Obrolan">
        {I.chat}
        {view === "chat" && dot}
      </button>
      <button className={btn(false)} onClick={onOpenSearch} title="Cari">
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
      <button className={btn(false)} onClick={onOpenMenu} title="Menu">
        {I.menu}
      </button>
    </nav>
  );
}

/* ---------- Modal pencarian ala spotlight (desktop) ---------- */
const SEARCH_RECENTS = [
  {
    id: 1,
    kind: "chat",
    title: "Obrolan utama",
    preview: "balikin cepirit ke tengah, header nya ubah jadi shadow aja",
    time: "baru saja",
  },
  {
    id: 2,
    kind: "wa",
    title: "WhatsApp",
    preview: "Kamu Dzikri, mahasiswa yang lagi belajar MSDM (Manajemen Su...",
    time: "2 jam yang lalu",
  },
];

export function SearchModal({ onClose, onSelect }) {
  const [q, setQ] = useState("");

  useEffect(() => {
    const h = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  const filtered = SEARCH_RECENTS.filter((r) =>
    (r.title + " " + r.preview).toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center px-4 pt-24">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-full max-w-xl bg-card rounded-3xl overflow-hidden shadow-2xl animate-pop-in">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10">
          <span className="text-gray-400">{I.search}</span>
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Cari"
            className="flex-1 bg-transparent outline-none text-[17px] placeholder-gray-500 text-white"
          />
        </div>
        <div className="p-3 max-h-[60vh] overflow-y-auto no-scrollbar">
          <div className="px-3 py-2 text-gray-500 text-[14px]">Terbaru</div>
          {filtered.map((r) => (
            <button
              key={r.id}
              onClick={() => onSelect(r)}
              className="w-full flex items-center gap-3 px-3 py-3 rounded-2xl hover:bg-card2 text-left transition-colors"
            >
              <span className="w-10 h-10 rounded-full bg-card2 flex items-center justify-center shrink-0 text-gray-300">
                {r.kind === "chat" ? (
                  I.chat
                ) : (
                  <span className="w-6 h-6 rounded-full bg-[#25d366] flex items-center justify-center text-white text-[13px]">◉</span>
                )}
              </span>
              <span className="flex-1 min-w-0">
                <span className="block font-medium text-[16px] text-white">{r.title}</span>
                <span className="block text-gray-500 text-[14px] truncate">{r.preview}</span>
              </span>
              <span className="text-gray-600 text-[12px] shrink-0">{r.time}</span>
            </button>
          ))}
          {filtered.length === 0 && (
            <div className="px-3 py-6 text-center text-gray-500 text-[15px]">Tidak ada hasil</div>
          )}
        </div>
      </div>
    </div>
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
    <div className="w-full h-full bg-[#171717] border-r border-white/10 py-4 overflow-y-auto no-scrollbar">
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
/* ---------- Ikon tambahan untuk panel profil ---------- */
const CLOCK_ICON = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round">
    <circle cx="12" cy="12" r="9" />
    <polyline points="12 7 12 12 15.5 14" />
  </svg>
);
const FINGERPRINT_ICON = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
    <path d="M12 11a3 3 0 0 0-3 3c0 2.5-.5 4.5-1.5 6" />
    <path d="M12 11a3 3 0 0 1 3 3c0 3-1 5.5-2.5 7" />
    <path d="M12 8a6 6 0 0 0-6 6c0 1.8-.3 3.3-.8 4.7" />
    <path d="M12 8a6 6 0 0 1 6 6c0 2.2-.4 4.1-1.2 5.7" />
    <path d="M12 5a9 9 0 0 0-9 9c0 1.2-.1 2.3-.3 3.4" />
    <path d="M12 5a9 9 0 0 1 9 9c0 1.5-.2 2.9-.5 4.2" />
  </svg>
);
const GITHUB_ICON = (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.35 1.08 2.92.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.1.39-1.99 1.03-2.69-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02a9.58 9.58 0 0 1 5 0c1.91-1.3 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.69 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85V21c0 .27.18.58.69.48A10 10 0 0 0 12 2z" />
  </svg>
);
const CHECK_CIRCLE = (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" />
    <polyline points="8.5 12.5 11 15 15.5 9.5" />
  </svg>
);

/* ---------- Data demo panel profil ---------- */
const HARI_INI = [
  { judul: "Perbesar Avatar Mobile", desc: "Avatar mobile diperbesar jadi 56px", waktu: "3:36 pm" },
  { judul: "Ubah Warna Background", desc: "Diubah ke abu-abu gelap #171717", waktu: "3:33 pm" },
  { judul: "Avatar Mobile", desc: "Avatar dipindah ke bar atas mobile", waktu: "3:15 pm" },
];
const RIWAYAT = [
  {
    judul: "Perform this action on your GitHub account",
    desc: "Muse ingin memperbesar lagi ukuran avatar CEPIRIT untuk tampilan mobile.",
    waktu: "Diizinkan • 3 menit yang lalu",
  },
  {
    judul: "Perform this action on your GitHub account",
    desc: "Muse ingin mengubah warna latar belakang menjadi abu-abu gelap.",
    waktu: "Diizinkan • 5 menit yang lalu",
  },
];

/* ---------- Isi profil CEPIRIT (panel kanan) ---------- */
export function ProfilCepirit() {
  const [tab, setTab] = useState(0);
  const tabs = [
    { icon: I.menu, label: "Hari ini" },
    { icon: I.shield, label: "Persetujuan" },
    { icon: CLOCK_ICON, label: "Harian" },
    { icon: FINGERPRINT_ICON, label: "Profil" },
  ];

  return (
    <div className="flex flex-col">
      {/* Header profil */}
      <div className="flex flex-col items-center">
        <div className="relative">
          <CepiritAvatar size={96} label={false} />
          <span className="absolute bottom-1 right-1 w-8 h-8 rounded-full bg-card2 border-2 border-[#171717] flex items-center justify-center text-gray-300">
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
      </div>

      {/* Tab ikon */}
      <div className="flex gap-1 mt-6 bg-card rounded-full p-1">
        {tabs.map((t, i) => (
          <button
            key={i}
            onClick={() => setTab(i)}
            title={t.label}
            className={`flex-1 h-9 rounded-full flex items-center justify-center transition-colors ${
              tab === i ? "bg-card2 text-white" : "text-gray-500 hover:text-gray-300"
            }`}
          >
            {t.icon}
          </button>
        ))}
      </div>

      {/* Tab: Hari ini */}
      {tab === 0 && (
        <div>
          <h3 className="text-[17px] font-semibold mt-6 mb-3">Hari ini</h3>
          <div className="space-y-1">
            {HARI_INI.map((a, i) => (
              <div key={i} className="flex items-start gap-3 px-2 py-3 rounded-2xl hover:bg-card/60">
                <span className="text-gray-400 shrink-0 mt-0.5">{CHECK_CIRCLE}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-[15px] text-white">{a.judul}</div>
                  <div className="text-gray-500 text-[13px] leading-snug mt-0.5">{a.desc}</div>
                  <div className="text-gray-600 text-[12px] mt-1">{a.waktu}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Riwayat persetujuan */}
      {tab === 1 && (
        <div>
          <h3 className="text-[17px] font-semibold mt-6 mb-3">Riwayat persetujuan</h3>
          <div className="space-y-1">
            {RIWAYAT.map((r, i) => (
              <div key={i} className="flex items-start gap-3 px-2 py-3 rounded-2xl hover:bg-card/60">
                <span className="text-gray-300 shrink-0 mt-0.5">{GITHUB_ICON}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-[15px] text-white leading-snug">{r.judul}</div>
                  <div className="text-gray-500 text-[13px] leading-snug mt-1">{r.desc}</div>
                  <div className="text-gray-600 text-[12px] mt-1">{r.waktu}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Harian */}
      {tab === 2 && (
        <div>
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
      )}

      {/* Tab: Profil */}
      {tab === 3 && (
        <div>
          <h3 className="text-[17px] font-semibold mt-6 mb-3">CEPIRIT</h3>
          <button className="w-full bg-card hover:bg-card2 rounded-full py-2.5 text-[15px] text-white flex items-center justify-center gap-2 transition-colors">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 3a2.8 2.8 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5z" />
            </svg>
            Edit
          </button>
          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="rounded-2xl p-4 bg-gradient-to-b from-[#ff5a5a] to-[#c81e1e] min-h-[110px] flex flex-col justify-between">
              <div className="font-bold text-[15px] text-white tracking-wide">SOUL</div>
              <div className="text-[11px] text-white/90 leading-tight">AKSES DENGAN HATI-HATI</div>
            </div>
            <div className="rounded-2xl p-4 bg-gradient-to-b from-[#4a7bff] to-[#1e3ac8] min-h-[110px] flex flex-col justify-between">
              <div className="font-bold text-[15px] text-white tracking-wide">MEMORI</div>
              <div className="text-[11px] text-white/90 leading-tight">AKSES DENGAN HATI-HATI</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- Panel kanan (desktop, tampilan chat) ---------- */
export function RightPanel({ onClose }) {
  return (
    <aside className="hidden xl:flex w-80 shrink-0 h-full border-l border-white/10 flex-col p-6 overflow-y-auto no-scrollbar bg-[#171717]">
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
      <div className="max-w-3xl mx-auto px-6 pt-14 pb-24 md:py-8">
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
      <div className="max-w-5xl mx-auto px-6 pt-14 pb-24 md:py-8">
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
/* ---------- Form Laporkan Masalah ---------- */
export function LaporMasalahForm({ onBack }) {
  const [isi, setIsi] = useState("");
  const [kategori, setKategori] = useState("");
  const [diagnostik, setDiagnostik] = useState(false);
  return (
    <div className="px-6 py-6">
      <div className="flex items-start justify-between mb-4">
        <h2 className="text-[20px] font-semibold">Laporkan masalah</h2>
        <button onClick={onBack} className="text-gray-400 hover:text-white text-2xl leading-none -mt-1" aria-label="Tutup">×</button>
      </div>
      <textarea
        value={isi}
        onChange={(e) => setIsi(e.target.value)}
        rows={5}
        placeholder="Jelaskan apa yang terjadi atau apa yang tidak berfungsi..."
        className="w-full bg-card2 rounded-2xl p-4 text-white outline-none placeholder-gray-500 text-[15px] resize-none"
      />
      <div className="flex gap-2 mt-3 flex-wrap">
        <button className="flex items-center gap-2 bg-card2 hover:bg-white/10 rounded-full px-4 py-2.5 text-[14px] text-white transition-colors">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
            <circle cx="12" cy="13" r="4" />
          </svg>
          Ambil gambar layar
        </button>
        <button className="flex items-center gap-2 bg-card2 hover:bg-white/10 rounded-full px-4 py-2.5 text-[14px] text-white transition-colors">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
          </svg>
          Tambahkan cuplikan layar atau video
        </button>
      </div>
      <div className="mt-5">
        <div className="text-[15px] font-medium mb-2">Kategori</div>
        <select
          value={kategori}
          onChange={(e) => setKategori(e.target.value)}
          className="w-full bg-black/40 border border-white/10 rounded-2xl px-4 py-3 text-[15px] text-gray-300 outline-none appearance-none"
        >
          <option value="" disabled>Pilih kategori</option>
          <option value="bug">Bug / tidak berfungsi</option>
          <option value="tampilan">Masalah tampilan</option>
          <option value="fitur">Usulan fitur</option>
          <option value="lain">Lainnya</option>
        </select>
      </div>
      <label className="flex items-start gap-3 mt-5 cursor-pointer">
        <input
          type="checkbox"
          checked={diagnostik}
          onChange={(e) => setDiagnostik(e.target.checked)}
          className="mt-1 w-4 h-4 accent-[#2b8cff]"
        />
        <span className="text-[14px] text-gray-300 leading-snug">Sertakan catatan dan diagnostik lengkap di laporan Anda</span>
      </label>
      <button
        disabled={!isi.trim()}
        onClick={onBack}
        className="mt-6 w-full bg-[#2b8cff] hover:bg-[#1f7ef0] disabled:opacity-40 text-white rounded-full py-3.5 font-semibold text-[16px] transition-colors"
      >
        Kirim laporan
      </button>
    </div>
  );
}

/* ---------- Form Buat Sasaran (modal ala muse.ai) ---------- */
export function SasaranForm({ kategori, onSubmit, onBack }) {
  return (
    <div className="px-6 py-6">
      <div className="flex items-start justify-between mb-4">
        <h2 className="text-[20px] font-semibold">Buat sasaran {kategori.label.toLowerCase()}</h2>
        <button onClick={onBack} className="text-gray-400 hover:text-white text-2xl leading-none -mt-1" aria-label="Tutup">×</button>
      </div>
      <p className="text-gray-300 text-[15px] leading-relaxed mb-6">
        Pertama, kita akan menyempurnakan sasaran bersama-sama dalam obrolan. Saya akan
        mengajukan beberapa pertanyaan untuk memperjelas apa yang Anda upayakan. Setelah
        itu, saya akan melacak kemajuan Anda di sini.
      </p>
      <button
        onClick={onSubmit}
        className="w-full bg-[#2b8cff] hover:bg-[#1f7ef0] text-white rounded-full py-3.5 font-semibold text-[16px] flex items-center justify-center gap-2 transition-colors"
      >
        <span>✦</span> Ayo lakukan
      </button>
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
