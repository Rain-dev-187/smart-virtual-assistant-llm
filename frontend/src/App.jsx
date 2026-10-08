import React, { useState } from "react";
import ChatScreen from "./components/ChatScreen";
import Drawer from "./components/Drawer";
import { MenuSheet, SettingsSheet } from "./components/SettingsMenu";
import Umum from "./components/Umum";
import Konektor from "./components/Konektor";
import Izin from "./components/Izin";
import KontrolData from "./components/KontrolData";
import { Dompet, Saluran, Bantuan, InfoHukum, Artefak, Perangkat } from "./components/SmallScreens";
import { Sheet } from "./components/ui";

export default function App() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [stack, setStack] = useState([]); // tumpukan halaman bottom-sheet

  const openSheet = (page) => setStack((s) => [...s, page]);
  const back = () => setStack((s) => s.slice(0, -1));
  const closeSheet = () => setStack([]);
  const current = stack[stack.length - 1];

  const renderPage = () => {
    const props = { onBack: back, onClose: closeSheet };
    switch (current) {
      case "menu":
        return <MenuSheet onClose={closeSheet} onOpenSettings={() => setStack(["settings"])} />;
      case "settings":
        return (
          <SettingsSheet
            onBack={back}
            onOpen={(key) => openSheet(key)}
            onLogout={() => {
              closeSheet();
              alert("Anda telah logout (demo).");
            }}
          />
        );
      case "umum":
        return <Umum {...props} />;
      case "konektor":
        return <Konektor {...props} />;
      case "dompet":
        return <Dompet {...props} />;
      case "kredensial":
        return (
          <div className="p-5">
            <div className="text-xl font-semibold mb-2">Penyimpanan kredensial aman</div>
            <p className="text-gray-400 text-[15px]">Kredensial Anda disimpan terenkripsi di brankas aman perangkat ini.</p>
          </div>
        );
      case "izin":
        return <Izin {...props} />;
      case "saluran":
        return <Saluran {...props} />;
      case "perangkat":
        return <Perangkat {...props} />;
      case "kontroldata":
        return <KontrolData {...props} />;
      case "bantuan":
        return <Bantuan {...props} />;
      case "infohukum":
        return <InfoHukum {...props} />;
      case "artefak":
        return <Artefak {...props} />;
      default:
        return null;
    }
  };

  return (
    <div className="h-full bg-black md:flex">
      {/* Sidebar permanen di desktop */}
      <aside className="hidden md:block w-72 lg:w-80 shrink-0 h-full border-r border-white/10">
        <Drawer asSidebar open onClose={() => {}} onOpenSheet={(page) => openSheet(page)} />
      </aside>

      {/* Area chat */}
      <div className="h-full md:flex-1 md:min-w-0 relative">
        <ChatScreen
          onOpenDrawer={() => setDrawerOpen(true)}
          onOpenMenu={() => openSheet("menu")}
        />

        {/* Drawer overlay khusus mobile */}
        <div className="md:hidden">
          <Drawer
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            onOpenSheet={(page) => {
              setDrawerOpen(false);
              openSheet(page);
            }}
          />
        </div>

        {current && (
          <Sheet onClose={closeSheet} labelled={current !== "artefak"}>
            {renderPage()}
          </Sheet>
        )}
      </div>
    </div>
  );
}
