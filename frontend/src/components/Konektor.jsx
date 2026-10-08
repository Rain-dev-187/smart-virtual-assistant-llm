import React, { useState } from "react";
import { SheetHeader, SectionTitle, ServiceTile } from "./ui";

const FEATURED = [
  { name: "Gmail", desc: "Anda bisa memberikan akses baca saja atau…", tile: ["#fff", <span key="g" className="text-[#ea4335]">M</span>] },
  { name: "Instagram", desc: "Ikuti kabar teman dan kreator yang Anda sukai", tile: ["linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)", "📷"] },
  { name: "Withings", desc: "Lacak berat badan, tekanan darah, wakt…", tile: ["#fff", "💙"] },
];

const SECTIONS = [
  {
    title: "Productivity",
    items: [
      { name: "Google Kalender", icon: ["#fff", <span key="c" className="text-accent text-sm font-bold">31</span>] },
      { name: "Google Drive", icon: ["#fff", "🔺"] },
      { name: "Keuangan (Plaid)", icon: ["#0b2b3c", "▦"] },
      { name: "Google Sheets", icon: ["#fff", <span key="s" className="text-[#0f9d58]">⊞</span>] },
      { name: "Google Dokumen", icon: ["#fff", <span key="d" className="text-[#1a73e8]">🗎</span>] },
    ],
  },
  {
    title: "Social & Entertainment",
    items: [
      { name: "Facebook", icon: ["#1877f2", "f"] },
      { name: "Messenger", icon: ["#fff", <span key="m" className="text-[#0099ff]">💬</span>] },
      { name: "Threads", icon: ["#000", <span key="t" className="border border-gray-500 rounded-full px-1">@</span>] },
      { name: "Pesan Instagram", icon: ["linear-gradient(45deg,#f09433,#dc2743,#bc1888)", "✉"] },
      { name: "Spotify", icon: ["#1db954", "♪"] },
    ],
  },
  {
    title: "Health & Fitness",
    items: [
      { name: "Peloton", icon: ["#fff", <span key="p" className="text-black">Ⓟ</span>] },
      { name: "Function Health", icon: ["#f5e6d0", <span key="f" className="text-[#b06a2a]">◍</span>] },
      { name: "HealthEx", icon: ["#ff9f1c", "⚡"] },
    ],
  },
  {
    title: "Business",
    items: [
      { name: "Pengelola Bisnis Meta", icon: ["#fff", <span key="b" className="text-[#0082fb]">∞</span>] },
      { name: "GitHub", icon: ["#fff", <span key="g2" className="text-black">🐙</span>] },
      { name: "Canva", icon: ["linear-gradient(135deg,#00c4cc,#7d2ae8)", "C"] },
      { name: "Dropbox", icon: ["#fff", <span key="db" className="text-[#0061ff]">⧉</span>] },
      { name: "Zoom", icon: ["#2d8cff", <span key="z" className="text-xs">zoom</span>] },
    ],
  },
];

export default function Konektor({ onBack, bare = false }) {
  const [tab, setTab] = useState("available");
  const [connected, setConnected] = useState(["WhatsApp"]);

  const toggle = (name) =>
    setConnected((c) => (c.includes(name) ? c.filter((x) => x !== name) : [...c, name]));

  return (
    <div>
      {!bare && <SheetHeader title="Konektor" onBack={onBack} />}

      {/* Tab */}
      <div className="mx-4 mt-1 bg-card2 rounded-full p-1.5 flex">
        {[
          ["available", "Available"],
          ["connected", "Connected"],
        ].map(([k, label]) => (
          <button
            key={k}
            onClick={() => setTab(k)}
            className={`flex-1 py-2.5 rounded-full text-[16px] font-medium ${tab === k ? "bg-card text-white" : "text-gray-300"}`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "connected" ? (
        <div className="px-5 mt-4 space-y-3">
          {connected.length === 0 && <p className="text-gray-400 text-[15px]">Belum ada konektor yang terhubung.</p>}
          {connected.map((n) => (
            <div key={n} className="bg-card2 rounded-2xl p-4 flex items-center justify-between">
              <span className="text-[16px]">{n}</span>
              <button onClick={() => toggle(n)} className="text-danger text-[15px]">Putuskan</button>
            </div>
          ))}
        </div>
      ) : (
        <div>
          <SectionTitle>Featured</SectionTitle>
          <div className="grid grid-cols-3 gap-3 px-4">
            {FEATURED.map((f) => (
              <div key={f.name} className="bg-card2 rounded-3xl p-3 flex flex-col">
                <ServiceTile bg={f.tile[0]}>{f.tile[1]}</ServiceTile>
                <div className="mt-2 text-[15px] font-semibold">{f.name}</div>
                <div className="text-gray-400 text-[12.5px] leading-snug line-clamp-3">{f.desc}</div>
                <button
                  onClick={() => toggle(f.name)}
                  className="mt-auto pt-2 text-accent text-[14px] text-left"
                >
                  {connected.includes(f.name) ? "Terhubung ✓" : "Connect"}
                </button>
              </div>
            ))}
          </div>

          {SECTIONS.map((s) => (
            <div key={s.title}>
              <div className="flex items-center justify-between pr-4">
                <SectionTitle>{s.title}</SectionTitle>
                <button className="text-gray-400 text-[15px] mt-6">See all ›</button>
              </div>
              <div className="mx-4 bg-card2 rounded-3xl divide-y divide-white/5">
                {s.items.map((it) => (
                  <div key={it.name} className="flex items-center gap-3 p-3.5">
                    <ServiceTile bg={it.icon[0]} size={48}>{it.icon[1]}</ServiceTile>
                    <span className="flex-1 text-[16px]">{it.name}</span>
                    <button
                      onClick={() => toggle(it.name)}
                      className={`text-[16px] ${connected.includes(it.name) ? "text-gray-400" : "text-accent"}`}
                    >
                      {connected.includes(it.name) ? "Terhubung" : "Connect"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
