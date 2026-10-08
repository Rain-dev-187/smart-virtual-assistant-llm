import React from "react";
import { I, MenuRow, SheetHeader } from "./ui";

/* ---------- Sheet "menu": Laporkan masalah / Pengaturan ---------- */
export function MenuSheet({ onOpenSettings, onClose }) {
  return (
    <div className="pt-2">
      <MenuRow
        icon={I.bug}
        title="Laporkan masalah"
        onClick={() => {}}
        right={null}
      />
      <MenuRow
        icon={I.gear}
        title="Pengaturan"
        onClick={onOpenSettings}
        right={null}
      />
    </div>
  );
}

/* ---------- Sheet daftar Pengaturan ---------- */
const ITEMS = [
  { key: "umum", icon: I.gear, title: "Umum" },
  { key: "konektor", icon: I.plug, title: "Konektor" },
  { key: "dompet", icon: I.wallet, title: "Dompet" },
  { key: "kredensial", icon: I.shield, title: "Penyimpanan kredensial aman" },
  { key: "izin", icon: "✋", title: "Izin" },
  { key: "saluran", icon: I.chat, title: "Saluran pengiriman pesan" },
  { key: "perangkat", icon: I.device, title: "Perangkat" },
  { key: "kontroldata", icon: I.data, title: "Kontrol data" },
  { key: "bantuan", icon: I.help, title: "Bantuan & dukungan" },
  { key: "infohukum", icon: I.doc, title: "Info hukum" },
];

export function SettingsSheet({ onBack, onOpen, onLogout }) {
  return (
    <div>
      <SheetHeader title="Pengaturan" onBack={onBack} />
      {ITEMS.map((it) => (
        <MenuRow
          key={it.key}
          icon={typeof it.icon === "string" ? <span className="text-xl">{it.icon}</span> : it.icon}
          title={it.title}
          onClick={() => onOpen(it.key)}
        />
      ))}
      <MenuRow icon={<span className="text-xl">↩</span>} title="Logout" danger onClick={onLogout} right={null} />
    </div>
  );
}
