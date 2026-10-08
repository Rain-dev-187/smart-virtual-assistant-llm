import React from "react";
import { SheetHeader, SectionTitle, I, ServiceTile } from "./ui";

/* ---------- Dompet ---------- */
export function Dompet({ onBack, bare = false }) {
  const methods = [
    { name: "Link by Stripe", icon: ["#00d66f", "›"] },
    { name: "Shop Pay", icon: ["#5a31f4", <span key="s" className="text-xs font-bold">shop</span>] },
  ];
  return (
    <div>
      {!bare && <SheetHeader title="Dompet" onBack={onBack} />}
      <p className="px-5 mt-1 text-[17px] leading-relaxed">
        Tambahkan metode pembayaran untuk mengizinkan CEPIRIT melakukan pembelian dan transaksi yang aman untuk Anda.
      </p>
      <SectionTitle>Metode pembayaran</SectionTitle>
      <div className="mx-4 bg-card2 rounded-3xl divide-y divide-white/5">
        {methods.map((m) => (
          <div key={m.name} className="flex items-center gap-4 p-4">
            <ServiceTile bg={m.icon[0]} size={48}>{m.icon[1]}</ServiceTile>
            <span className="flex-1 text-[17px]">{m.name}</span>
            <button className="text-accent text-[16px]">Tambahkan</button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- Saluran pengiriman pesan ---------- */
export function Saluran({ onBack, bare = false }) {
  return (
    <div>
      {!bare && <SheetHeader title="Saluran pengiriman pesan" onBack={onBack} />}
      <p className="px-5 mt-1 text-[17px] leading-relaxed">
        Mengobrol dengan agen Anda di aplikasi pengiriman pesan lainnya.
      </p>
      <SectionTitle>Tersedia</SectionTitle>
      <div className="mx-4 bg-card2 rounded-3xl p-4 flex items-center gap-4">
        <ServiceTile bg="#25d366" size={48}>◉</ServiceTile>
        <span className="flex-1 text-[17px]">WhatsApp</span>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2.2" strokeLinecap="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </div>
    </div>
  );
}

/* ---------- Bantuan & dukungan ---------- */
export function Bantuan({ onBack, bare = false }) {
  const rows = ["Pusat Bantuan CEPIRIT", "Kirimkan masukan"];
  return (
    <div>
      {!bare && <SheetHeader title="Bantuan & dukungan" onBack={onBack} />}
      <div className="mx-4 mt-2 bg-card2 rounded-3xl divide-y divide-white/5">
        {rows.map((r) => (
          <button key={r} className="w-full flex items-center justify-between p-5 text-[17px] text-left">
            {r}
            <span className="text-gray-500">↗</span>
          </button>
        ))}
      </div>
      <div className="mx-4 mt-4 bg-card2 rounded-3xl p-5 flex items-center justify-between">
        <span className="text-[17px]">Laporkan masalah</span>
        <span className="text-gray-300">{I.bug}</span>
      </div>
    </div>
  );
}

/* ---------- Info hukum ---------- */
export function InfoHukum({ onBack, bare = false }) {
  const docs = [
    "Kebijakan Privasi CEPIRIT",
    "Ketentuan Tambahan CEPIRIT",
    "Ketentuan Layanan Meta",
    "Kebijakan Privasi Meta",
    "Ketentuan Layanan Meta AI",
  ];
  return (
    <div>
      {!bare && <SheetHeader title="Info hukum" onBack={onBack} />}
      <p className="px-5 mt-1 text-[16px] text-gray-300 leading-relaxed">
        Tanggapan dibuat oleh AI. Beberapa mungkin tidak akurat atau tidak sesuai.{" "}
        <button className="text-accent">Pelajari selengkapnya</button>
      </p>
      <div className="mx-4 mt-4 bg-card2 rounded-3xl divide-y divide-white/5">
        {docs.map((d) => (
          <button key={d} className="w-full flex items-center justify-between p-5 text-[17px] text-left">
            {d}
            <span className="text-gray-500">↗</span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ---------- Artefak / Library ---------- */
export function Artefak({ onBack, onClose }) {
  return (
    <div className="min-h-[70vh] flex flex-col">
      <div className="flex items-center justify-between px-5 py-4">
        <button onClick={onBack} className="flex items-center gap-1 text-[26px] font-bold">
          Semua artefak
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2.2" strokeLinecap="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
        <div className="flex items-center gap-3">
          <button className="w-11 h-11 rounded-full bg-card2 flex items-center justify-center text-xl" aria-label="Opsi">⋯</button>
          <button className="w-11 h-11 rounded-full bg-accent flex items-center justify-center text-3xl leading-none" aria-label="Tambah">+</button>
        </div>
      </div>
      <div className="flex-1" />
      <button onClick={onClose} className="mx-5 mb-2 text-accent text-[16px]">Tutup</button>
    </div>
  );
}

/* ---------- Perangkat (kosong, sesuai screenshot) ---------- */
export function Perangkat({ onBack, bare = false }) {
  return (
    <div className="min-h-[60vh] flex flex-col">
      {!bare && <SheetHeader title="Perangkat" onBack={onBack} />}
      <div className="flex-1 flex flex-col items-center justify-center text-gray-400 gap-3">
        <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="7" y="2.5" width="10" height="19" rx="2" />
          <rect x="2" y="6" width="10" height="14" rx="2" />
        </svg>
        <p className="text-[17px]">Tidak ditemukan perangkat.</p>
      </div>
    </div>
  );
}
