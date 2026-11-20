import React, { useState, useEffect, useRef } from "react";
import { I } from "./ui";
import Umum from "./Umum";
import Konektor from "./Konektor";
import Izin from "./Izin";
import KontrolData from "./KontrolData";
import { Dompet, Saluran, Bantuan, InfoHukum, Perangkat } from "./SmallScreens";

const SECTIONS = [
  { key: "umum", icon: I.gear, title: "Umum" },
  { key: "konektor", icon: I.plug, title: "Konektor" },
  { key: "dompet", icon: I.wallet, title: "Dompet" },
  { key: "kredensial", icon: I.shield, title: "Penyimpanan aman" },
  { key: "izin", icon: <span className="text-xl leading-none">✋</span>, title: "Izin" },
  { key: "saluran", icon: I.chat, title: "Saluran pengiriman pesan" },
  { key: "perangkat", icon: I.device, title: "Perangkat" },
  { key: "kontroldata", icon: I.data, title: "Kontrol data" },
  { key: "bantuan", icon: I.help, title: "Bantuan & dukungan" },
  { key: "infohukum", icon: I.doc, title: "Info hukum" },
];

/* ---------- Modal Pengaturan 2 kolom ala muse.ai ---------- */
export default function SettingsModal({ onClose, onLogout }) {
  const [section, setSection] = useState("umum");
  const [mDetail, setMDetail] = useState(false); // tampilan detail di layar kecil

  useEffect(() => {
    const h = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  /* Geser ke bawah buat nutup (HP): sheet nempel di bawah dengan ruang
     di atasnya, garis pegangan di atas jadi tempat tariknya. Polanya sama
     seperti Sheet biasa: tarik dari 60px teratas, lepas di atas 100px. */
  const panelRef = useRef(null);
  const drag = useRef({ active: false, startY: 0, grab: false, pulledDy: 0 });
  const [dragY, setDragY] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [closing, setClosing] = useState(false);
  const closeTimer = useRef(null);
  useEffect(() => () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }, []);
  const onTouchStart = (e) => {
    if (closing || !window.matchMedia("(max-width: 767px)").matches) return;
    const y = e.touches[0].clientY;
    const rect = panelRef.current ? panelRef.current.getBoundingClientRect() : null;
    drag.current = { active: true, startY: y, grab: rect ? y - rect.top < 60 : false, pulledDy: 0 };
    setDragging(true);
  };
  const onTouchMove = (e) => {
    const d = drag.current;
    if (!d.active || closing) return;
    const dy = e.touches[0].clientY - d.startY;
    if (dy > 0 && d.grab) {
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

  const active = SECTIONS.find((s) => s.key === section);

  const renderContent = () => {
    const p = { bare: true };
    switch (section) {
      case "umum":
        return <Umum {...p} />;
      case "konektor":
        return <Konektor {...p} />;
      case "dompet":
        return <Dompet {...p} />;
      case "kredensial":
        return (
          <div className="p-5">
            <p className="text-gray-400 text-[15px] leading-relaxed">
              Kredensial Anda disimpan terenkripsi di brankas aman perangkat ini dan tidak pernah
              dibagikan tanpa izin Anda.
            </p>
          </div>
        );
      case "izin":
        return <Izin {...p} />;
      case "saluran":
        return <Saluran {...p} />;
      case "perangkat":
        return <Perangkat {...p} />;
      case "kontroldata":
        return <KontrolData {...p} />;
      case "bantuan":
        return <Bantuan {...p} />;
      case "infohukum":
        return <InfoHukum {...p} />;
      default:
        return null;
    }
  };

  const nav = (
    <div className="flex flex-col h-full">
      <div className="px-5 pt-5 pb-3 shrink-0 [touch-action:none]">
        <h2 className="text-[22px] font-semibold text-white">Pengaturan</h2>
      </div>
      <div className="flex-1 overflow-y-auto no-scrollbar px-3 pb-3">
        {SECTIONS.map((s) => (
          <button
            key={s.key}
            onClick={() => {
              setSection(s.key);
              setMDetail(true);
            }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors ${
              section === s.key ? "bg-card2/80 text-white" : "text-gray-300 hover:bg-card2/40"
            }`}
          >
            <span className="shrink-0 w-6 flex justify-center">{s.icon}</span>
            <span className="text-[16px] truncate">{s.title}</span>
          </button>
        ))}
      </div>
      <div className="p-3 shrink-0 border-t border-white/5">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-gray-300 hover:bg-card2/40 transition-colors"
        >
          <span className="shrink-0 w-6 flex justify-center text-xl leading-none">↩</span>
          <span className="text-[16px]">Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[60] flex items-end md:items-center justify-center md:p-4">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div
        ref={panelRef}
        className="relative w-full md:max-w-4xl h-[80vh] bg-card rounded-t-3xl md:rounded-3xl flex flex-col overflow-hidden shadow-2xl animate-pop-in"
        style={{
          transform: dragY ? `translateY(${dragY}px)` : undefined,
          transition: dragging ? "none" : "transform 200ms ease-out",
        }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Garis pegangan buat geser tutup — hanya di HP. touch-action none
            supaya browser tidak merebut gestur ini jadi pull-to-refresh. */}
        <div className="pt-3 pb-2 flex justify-center shrink-0 md:hidden [touch-action:none]">
          <div className="w-10 h-1 rounded-full bg-gray-600" />
        </div>
        <div className="flex-1 flex min-h-0">
        {/* Kolom kiri: navigasi */}
        <div
          className={`shrink-0 h-full border-r border-white/10 bg-black/20 ${
            mDetail ? "hidden md:block w-72" : "w-full md:w-72"
          }`}
        >
          {nav}
        </div>

        {/* Kolom kanan: konten */}
        <div className={`flex-1 h-full flex-col min-w-0 ${mDetail ? "flex" : "hidden md:flex"}`}>
          <div className="flex items-center gap-2 px-5 py-4 shrink-0 border-b border-white/5 [touch-action:none]">
            <button
              onClick={() => setMDetail(false)}
              className="md:hidden w-9 h-9 rounded-full hover:bg-card2 flex items-center justify-center text-gray-300"
              aria-label="Kembali"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <h2 className="flex-1 text-[20px] font-semibold text-white">{active?.title}</h2>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full hover:bg-card2 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
              aria-label="Tutup pengaturan"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto no-scrollbar py-2">{renderContent()}</div>
        </div>
        </div>
      </div>
    </div>
  );
}
