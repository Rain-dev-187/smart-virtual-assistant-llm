import React, { useState } from "react";
import { SheetHeader, SectionTitle, Toggle, I } from "./ui";

function Choice({ title, desc, selected, onSelect }) {
  return (
    <button onClick={onSelect} className="w-full text-left py-3">
      <div className="flex items-center justify-between">
        <span className="text-[17px]">{title}</span>
        {selected && <span className="text-white">{I.check}</span>}
      </div>
      <div className="text-gray-400 text-[14px] mt-0.5 pr-8">{desc}</div>
    </button>
  );
}

export default function Izin({ onBack, bare = false }) {
  const [tindakan, setTindakan] = useState("sebagian");
  const [web, setWeb] = useState("sebagian");
  const [proxy, setProxy] = useState(false);
  const [tls, setTls] = useState(false);
  const [sni, setSni] = useState(true);
  const [lanjut, setLanjut] = useState(false);

  const grants = [
    ["Konektor", 1],
    ["Situs Web", 0],
    ["Artefak", 0],
    ["Tugas terjadwal", 0],
    ["Protokol jaringan langsung", 8],
  ];

  return (
    <div>
      {!bare && <SheetHeader title="Izin" onBack={onBack} />}

      <div className="mx-4 mt-1 bg-card2 rounded-3xl px-5 py-2 divide-y divide-white/5">
        <Choice
          title="Minta beberapa tindakan"
          desc="Sebelum tindakan yang bisa membagikan informasi Anda atau membuat perubahan penting"
          selected={tindakan === "sebagian"}
          onSelect={() => setTindakan("sebagian")}
        />
        <Choice
          title="Selalu tanyakan"
          desc="Sebelum tindakan apa pun"
          selected={tindakan === "selalu"}
          onSelect={() => setTindakan("selalu")}
        />
      </div>

      <SectionTitle>Default akses web</SectionTitle>
      <div className="mx-4 bg-card2 rounded-3xl px-5 py-2 divide-y divide-white/5">
        <Choice
          title="Minta beberapa tindakan"
          desc="Saat informasi Anda mungkin dibagikan atau situs web tidak dikenal"
          selected={web === "sebagian"}
          onSelect={() => setWeb("sebagian")}
        />
        <Choice
          title="Selalu tanyakan"
          desc="Tanyakan sebelum mengakses situs web apa pun"
          selected={web === "selalu"}
          onSelect={() => setWeb("selalu")}
        />
      </div>

      <SectionTitle>Kelola izin</SectionTitle>
      <div className="mx-4 bg-card2 rounded-3xl px-5 divide-y divide-white/5">
        {grants.map(([name, n]) => (
          <div key={name} className="flex items-center justify-between py-4">
            <span className="text-[17px]">{name}</span>
            <span className="flex items-center gap-2 text-gray-400 text-[16px]">
              {n}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </span>
          </div>
        ))}
      </div>

      <button
        onClick={() => setLanjut(!lanjut)}
        className="w-full flex items-center justify-between px-5 mt-6"
      >
        <span className="text-gray-300 text-[17px] font-medium">Pengaturan jaringan lanjutan</span>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2.2" strokeLinecap="round"
          style={{ transform: lanjut ? "rotate(180deg)" : "none" }}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {lanjut && (
        <div className="mx-4 mt-2 bg-card2 rounded-3xl px-5 divide-y divide-white/5">
          <div className="py-4">
            <div className="flex items-center justify-between">
              <span className="text-[17px]">Proxy transparan</span>
              <Toggle checked={proxy} onChange={setProxy} />
            </div>
            <p className="text-gray-400 text-[14px] mt-1 pr-16">Semua traffic harus melalui proxy HTTP eksplisit.</p>
          </div>
          <div className="py-4">
            <div className="flex items-center justify-between">
              <span className="text-[17px]">Intersepsi TLS</span>
              <Toggle checked={tls} onChange={setTls} />
            </div>
            <p className="text-gray-400 text-[14px] mt-1 pr-16">Koneksi TLS hanya disadap jika diwajibkan oleh kebijakan.</p>
          </div>
          <div className="py-4">
            <div className="flex items-center justify-between">
              <span className="text-[17px]">Penolakan ketidakcocokan SNI</span>
              <Toggle checked={sni} onChange={setSni} />
            </div>
            <p className="text-gray-400 text-[14px] mt-1 pr-16">Koneksi ditolak saat TLS SNI tidak cocok dengan destinasi.</p>
          </div>
        </div>
      )}

      <div className="mx-4 mt-4 bg-card2 rounded-3xl p-5">
        <button className="text-danger text-[17px]">Atur ulang persetujuan ke default</button>
      </div>
    </div>
  );
}
