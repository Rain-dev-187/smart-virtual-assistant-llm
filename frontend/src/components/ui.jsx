import React, { useRef, useState, useEffect } from "react";
import { DEFAULT_AVATAR, useAvatar } from "../lib/avatar";
import { urlFileLampiranAsync } from "../lib/lampiran";

/* ---------- Bagian topi avatar ---------- */
function AvatarHat({ hat }) {
  if (hat === "topi") {
    return (
      <g transform="rotate(-8 48 27)">
        <path d="M25 33 Q48 13 71 33 Z" fill="#3b82f6" />
        <path d="M60 29 Q86 27 89 35 Q75 39 60 35 Z" fill="#2563eb" />
        <circle cx="48" cy="19" r="3" fill="#2563eb" />
      </g>
    );
  }
  if (hat === "mahkota") {
    return (
      <g transform="rotate(-8 48 27)">
        <polygon points="28,36 28,20 38,28 48,16 58,28 68,20 68,36" fill="#ffd166" stroke="#e0a800" strokeWidth="1.5" />
        <circle cx="48" cy="27" r="2.6" fill="#ff5a5a" />
      </g>
    );
  }
  if (hat === "none") return null;
  /* toga (bawaan) */
  return (
    <g transform="rotate(-8 48 27)">
      <polygon points="48,14 80,27 48,40 16,27" fill="#6a5cff" />
      <polygon points="48,14 80,27 48,40 16,27" fill="none" stroke="#8f88ff" strokeWidth="1.5" opacity="0.6" />
      <rect x="40" y="32" width="16" height="9" rx="2" fill="#6a5cff" />
      <line x1="78" y1="27" x2="78" y2="44" stroke="#ffd166" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="78" cy="47" r="3.5" fill="#ffd166" />
    </g>
  );
}

/* ---------- Avatar "VITY" animasi ----------
   Props:
   - config: { body, hat, accessory } — bawaan: konfigurasi global user
   - state: "idle" (goyang pelan) | "working" (lompat-lompat saat progress berjalan)
*/
export function VityAvatar({ size = 64, label = true, config, state = "idle" }) {
  const global = useAvatar();
  const cfg = { ...DEFAULT_AVATAR, ...(config || global.config) };
  const working = state === "working";
  return (
    <div className="flex flex-col items-center">
      <div
        className="rounded-full overflow-hidden shrink-0"
        style={{ width: size, height: size, background: "transparent" }}
      >
        <svg viewBox="0 0 96 96" width={size} height={size}>
          {/* bayangan bawah */}
          <ellipse cx="48" cy="88" rx="24" ry="4" fill="#000" opacity="0.25" />
          {/* kepala + topi: goyang pelan saat idle, lompat-lompat saat working */}
          <g className={working ? "vity-bounce" : "vity-sway"}>
            <circle cx="48" cy="56" r="30" fill={cfg.body} />
            <ellipse cx="40" cy="46" rx="10" ry="6" fill="#fff" opacity="0.35" />
            <AvatarHat hat={cfg.hat} />
            {/* mata + pupil (kedip; pupil melirik, lebih cepat saat working) */}
            <g className="vity-blink">
              <circle cx="38" cy="58" r="7" fill="#fff" />
              <circle cx="58" cy="58" r="7" fill="#fff" />
              <g className={`vity-look ${working ? "vity-look-fast" : ""}`}>
                <circle cx="38" cy="58" r="3.5" fill="#2b2b2b" />
                <circle cx="58" cy="58" r="3.5" fill="#2b2b2b" />
                <circle cx="39.2" cy="56.8" r="1.1" fill="#fff" />
                <circle cx="59.2" cy="56.8" r="1.1" fill="#fff" />
              </g>
            </g>
            {/* kacamata */}
            {cfg.accessory === "kacamata" && (
              <g stroke="#2b2b2b" strokeWidth="2.2" fill="none" strokeLinecap="round">
                <circle cx="38" cy="58" r="10" />
                <circle cx="58" cy="58" r="10" />
                <line x1="28" y1="55" x2="20" y2="49" />
                <line x1="68" y1="55" x2="76" y2="49" />
              </g>
            )}
            {/* pipi */}
            <circle cx="29" cy="68" r="4" fill="#ff8fa3" opacity="0.65" />
            <circle cx="67" cy="68" r="4" fill="#ff8fa3" opacity="0.65" />
            {/* senyum */}
            <path d="M38 73 Q48 82 58 73" stroke="#4a2410" strokeWidth="3.5" fill="none" strokeLinecap="round" />
          </g>
          {/* percikan bintang saat bekerja */}
          {working && (
            <>
              <polygon className="vity-spark" points="14,26 16,32 22,34 16,36 14,42 12,36 6,34 12,32" fill="#ffd166" />
              <polygon className="vity-spark vity-spark-2" points="82,52 83.5,57 88.5,58.5 83.5,60 82,65 80.5,60 75.5,58.5 80.5,57" fill="#ffd166" />
            </>
          )}
        </svg>
      </div>
      {label && (
        <div className="mt-1 bg-card2 text-white text-sm font-medium px-4 py-1 rounded-full">
          VITY
        </div>
      )}
    </div>
  );
}

/* ---------- Bottom sheet generik (jadi modal tengah di desktop) ----------
   Bisa ditutup dengan geser ke bawah (swipe down): tarik dari gagang /
   bar atas, atau dari mana pun saat konten sudah di posisi paling atas.
   Kalau konten masih ter-scroll, geser ke bawah mengembalikan scroll dulu.
   Lewat ambang 100px, sheet meluncur keluar lalu menutup. */
export function Sheet({ children, onClose, labelled = true }) {
  const panelRef = useRef(null);
  const scrollRef = useRef(null);
  const drag = useRef({ active: false, startY: 0, grab: false, pulledDy: 0 });
  const [dragY, setDragY] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [closing, setClosing] = useState(false);
  const closeTimer = useRef(null);

  useEffect(() => () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }, []);

  const onTouchStart = (e) => {
    if (closing) return;
    const y = e.touches[0].clientY;
    const rect = panelRef.current ? panelRef.current.getBoundingClientRect() : null;
    drag.current = { active: true, startY: y, grab: rect ? y - rect.top < 60 : false, pulledDy: 0 };
    setDragging(true);
  };
  const onTouchMove = (e) => {
    const d = drag.current;
    if (!d.active || closing) return;
    const dy = e.touches[0].clientY - d.startY;
    const scroller = scrollRef.current;
    if (dy > 0 && (d.grab || (scroller && scroller.scrollTop <= 0))) {
      /* Ikuti jari ke bawah (tanpa preventDefault: listener React pasif) */
      d.pulledDy = dy;
      setDragY(dy);
    } else if (dy <= 0) {
      d.pulledDy = 0;
      if (dragY !== 0) setDragY(0);
    }
  };
  const onTouchEnd = () => {
    const d = drag.current;
    if (!d.active) return;
    d.active = false;
    setDragging(false);
    if (d.pulledDy > 100) {
      setClosing(true);
      setDragY(window.innerHeight);
      closeTimer.current = setTimeout(onClose, 200);
    } else {
      setDragY(0);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center md:p-6">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div
        ref={panelRef}
        className="relative w-full max-w-md md:max-w-lg bg-card rounded-t-3xl md:rounded-3xl max-h-[80vh] md:max-h-[85vh] flex flex-col overflow-hidden"
        style={{
          transform: dragY ? `translateY(${dragY}px)` : undefined,
          transition: dragging ? "none" : "transform 200ms ease-out",
        }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {labelled && (
          <div className="pt-3 pb-1 flex justify-center shrink-0 md:hidden [touch-action:none]">
            <div className="w-10 h-1 rounded-full bg-gray-600" />
          </div>
        )}
        <div ref={scrollRef} className="overflow-y-auto no-scrollbar pb-8">{children}</div>
      </div>
    </div>
  );
}

/* ---------- Penampil gambar layar penuh ---------- */
/* ---------- Penampil gambar layar penuh ---------- */
export function Lightbox({ items, index, onIndex, onClose, onDelete }) {
  const item = items[index] || null;
  const [src, setSrc] = useState(null);
  const [gagal, setGagal] = useState(false);
  /* URL gambar diambil dari blob sesi / IndexedDB / data URL — yang dibuka
     bisa jadi file asli (resolusi penuh), bukan cuma thumb kecil. */
  useEffect(() => {
    if (!item) return undefined;
    let hidup = true;
    setSrc(null);
    setGagal(false);
    urlFileLampiranAsync(item).then((u) => {
      if (!hidup) return;
      const final = u || item.dataUrl || item.thumb || null;
      setSrc(final);
      setGagal(!final);
    });
    return () => {
      hidup = false;
    };
  }, [item]);
  /* Kalau daftar gambar menyusut (mis. habis dihapus), jaga indeks tetap
     valid; kalau habis, tutup. */
  useEffect(() => {
    if (items.length === 0) onClose();
    else if (index >= items.length) onIndex(items.length - 1);
  }, [items.length, index, onClose, onIndex]);
  useEffect(() => {
    const h = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onIndex(Math.max(0, index - 1));
      if (e.key === "ArrowRight") onIndex(Math.min(items.length - 1, index + 1));
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose, index, items.length, onIndex]);
  if (!item) return null;
  const nama = item.nama || "Gambar";
  const unduh = () => {
    if (!src) return;
    const a = document.createElement("a");
    a.href = src;
    a.download = nama;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };
  /* Tombol panah ke atas itu Share. Tapi Web Share cuma ada di konteks
     aman (https/localhost) — VITY di HP jalan lewat http:// LAN, jadi
     browser tidak menyediakan navigator.share sama sekali. Kalau begitu,
     buka gambar di tab baru supaya bisa dibagikan dari menu browser
     (tekan lama gambarnya). Cek ketersediaan share dilakukan sinkron
     supaya tab baru tidak diblokir pemblokir pop-up. */
  const bagikan = async () => {
    if (!src) return;
    if (!navigator.share) {
      window.open(src, "_blank");
      return;
    }
    try {
      const blob = await (await fetch(src)).blob();
      const file = new File([blob], nama, { type: blob.type || "image/png" });
      if (navigator.canShare && !navigator.canShare({ files: [file] })) {
        window.open(src, "_blank");
        return;
      }
      await navigator.share({ files: [file] });
    } catch (e) {
      if (e && e.name === "AbortError") return; // user menutup share sheet
      window.open(src, "_blank");
    }
  };
  const tombolAksi = "w-11 h-11 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center shrink-0";
  return (
    <div className="fixed inset-0 z-[70] bg-black flex flex-col">
      <div className="flex items-center justify-between px-3 pt-3 shrink-0">
        <button onClick={onClose} className={`${tombolAksi} text-2xl leading-none`} aria-label="Tutup">
          ×
        </button>
        <div className="flex items-center gap-2">
          <button onClick={bagikan} className={tombolAksi} aria-label="Bagikan">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" /><polyline points="16 6 12 2 8 6" /><line x1="12" y1="2" x2="12" y2="15" /></svg>
          </button>
          {onDelete && (
            <button onClick={onDelete} className={tombolAksi} aria-label="Hapus">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
            </button>
          )}
          <button onClick={unduh} className={tombolAksi} aria-label="Unduh">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
          </button>
        </div>
      </div>
      <div className="relative flex-1 min-h-0 flex items-center justify-center" onClick={onClose}>
        {src ? (
          <img src={src} alt={nama} className="max-w-full max-h-full object-contain" onClick={(e) => e.stopPropagation()} />
        ) : gagal ? (
          <div className="text-gray-400 px-6 text-center text-[15px]">Gambar ini tidak bisa dibuka lagi. Upload ulang ya.</div>
        ) : (
          <div className="text-gray-400">Memuat…</div>
        )}
        {items.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); onIndex(Math.max(0, index - 1)); }}
              disabled={index === 0}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center disabled:opacity-30"
              aria-label="Sebelumnya"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onIndex(Math.min(items.length - 1, index + 1)); }}
              disabled={index === items.length - 1}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center disabled:opacity-30"
              aria-label="Berikutnya"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
            </button>
          </>
        )}
      </div>
    </div>
  );
}

/* ---------- Penampil PDF di dalam aplikasi ---------- */
export function PdfViewer({ url, nama, onClose, onDelete }) {
  /* iframe di iOS tidak selalu mau menampilkan data: URL — jadi data URL
     diubah dulu jadi blob URL saat dibuka (blob selalu tampil). */
  const [src, setSrc] = useState(url.startsWith("blob:") ? url : null);
  useEffect(() => {
    if (url.startsWith("blob:")) return undefined;
    let hidup = true;
    let blobUrl = null;
    fetch(url)
      .then((r) => r.blob())
      .then((b) => {
        blobUrl = URL.createObjectURL(b);
        if (hidup) setSrc(blobUrl);
      })
      .catch(() => {
        if (hidup) setSrc(url);
      });
    return () => {
      hidup = false;
      if (blobUrl) URL.revokeObjectURL(blobUrl);
    };
  }, [url]);
  const [menu, setMenu] = useState(false);
  useEffect(() => {
    const h = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);
  const unduh = () => {
    const a = document.createElement("a");
    a.href = url;
    a.download = nama || "dokumen.pdf";
    document.body.appendChild(a);
    a.click();
    a.remove();
    setMenu(false);
  };
  return (
    <div className="fixed inset-0 z-[80] bg-black flex flex-col">
      <div className="flex items-center gap-2 px-4 h-14 shrink-0">
        <div className="flex-1 min-w-0 text-[17px] font-medium text-white truncate">{nama || "Dokumen"}</div>
        <button
          onClick={() => setMenu((v) => !v)}
          className="w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center text-white shrink-0"
          aria-label="Opsi"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="1.8" /><circle cx="12" cy="12" r="1.8" /><circle cx="19" cy="12" r="1.8" /></svg>
        </button>
        <button
          onClick={onClose}
          className="w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center text-white text-2xl leading-none shrink-0"
          aria-label="Tutup"
        >
          ×
        </button>
      </div>
      {src ? (
        <iframe src={src} title={nama || "Dokumen"} className="flex-1 w-full border-0 bg-white" />
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-400">Memuat…</div>
      )}
      {menu && (
        <div className="absolute inset-0 z-10" onClick={() => setMenu(false)}>
          <div className="absolute inset-x-0 bottom-0 bg-card rounded-t-3xl px-2 pt-2 pb-6" onClick={(e) => e.stopPropagation()}>
            <div className="pt-2 pb-1 flex justify-center">
              <div className="w-10 h-1 rounded-full bg-gray-600" />
            </div>
            <button onClick={unduh} className="w-full flex items-center gap-3 px-4 py-3.5 text-left text-white text-[17px]">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
              Download
            </button>
            {onDelete && (
              <button
                onClick={() => { setMenu(false); onDelete(); }}
                className="w-full flex items-center gap-3 px-4 py-3.5 text-left text-danger text-[17px]"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                Delete
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- Header sheet dengan tombol back ---------- */
export function SheetHeader({ title, onBack }) {
  return (
    <div className="flex items-center gap-2 px-4 py-3 sticky top-0 bg-card z-10">
      {onBack && (
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-full bg-card2 flex items-center justify-center text-white"
          aria-label="Kembali"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
      )}
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

/* Ikon garis 3 untuk hamburger atas mobile */
const MENU_3 = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="4" y1="7" x2="20" y2="7" />
    <line x1="4" y1="12" x2="20" y2="12" />
    <line x1="4" y1="17" x2="20" y2="17" />
  </svg>
);

/* ---------- Bar atas mobile (flex child, bukan fixed) ----------
   Dulu fixed top-0: saat toolbar browser HP muncul/hilang atau keyboard
   buka-tutup, bar ini dan konten 100dvh tidak sepakat soal "atas" — halaman
   terasa ngangkat/lompat. Sekarang ikut alur flex kolom App. */
export function MobileTopBar({ onOpenDrawer, onOpenProfile, view }) {
  return (
    <div className="md:hidden shrink-0 flex items-center justify-between px-2 pt-1">
      <button
        onClick={onOpenDrawer}
        className="w-11 h-11 flex items-center justify-center text-white"
        aria-label="Buka menu"
      >
        {MENU_3}
      </button>
      {view === "chat" ? (
        <button
          onClick={onOpenProfile}
          className="rounded-full animate-pop-in"
          aria-label="Lihat profil VITY"
        >
          <VityAvatar size={56} label={false} />
        </button>
      ) : (
        <div className="w-[56px] shrink-0" />
      )}
      <div className="w-11 shrink-0" />
    </div>
  );
}

/* ---------- Tab bar bawah (mobile) ----------
   Dulu fixed bottom-0: alasan yang sama dengan MobileTopBar — fixed dan
   konten 100dvh berdebat soal "bawah" saat toolbar/keyboard berubah,
   tab bar melayang dengan ruang kosong di bawahnya. Sekarang flex child. */
const tabCheck = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 11 12 14 22 4" />
    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
  </svg>
);

export function MobileTabBar({ view, onView, onOpenMenu }) {
  const tabs = [
    { key: "chat", label: "Obrolan", icon: I.chat },
    { key: "sasaran", label: "Sasaran", icon: tabCheck },
    { key: "galeri", label: "Galeri", icon: I.plug },
  ];
  return (
    <nav
      className="md:hidden shrink-0 flex justify-around px-8 pt-2 bg-[#171717]"
      style={{ paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))" }}
    >
      {tabs.map((t) => {
        const active = view === t.key;
        return (
          <button
            key={t.key}
            onClick={() => onView(t.key)}
            aria-label={t.label}
            className={`relative flex flex-col items-center gap-1 px-5 py-1 ${
              active ? "text-white" : "text-gray-600"
            }`}
          >
            {t.icon}
            {active && <span className="w-1.5 h-1.5 rounded-full bg-accent" />}
          </button>
        );
      })}
      <button
        onClick={onOpenMenu}
        aria-label="Menu"
        className="relative flex flex-col items-center gap-1 px-5 py-1 text-gray-600"
      >
        {I.menu}
      </button>
    </nav>
  );
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
      <line x1="4" y1="9" x2="20" y2="9" />
      <line x1="4" y1="15" x2="20" y2="15" />
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
