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
import {
  IconRail,
  GaleriSidebar,
  RightPanel,
  ProfilCepirit,
  SasaranPage,
  GaleriPage,
  SasaranForm,
  ArtefakForm,
  GALERI_LABEL,
  TIPE_ARTEFAK,
} from "./components/Desktop";

export default function App() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [stack, setStack] = useState([]); // tumpukan halaman bottom-sheet
  const [view, setView] = useState("chat"); // chat | sasaran | galeri
  const [chatSide, setChatSide] = useState(false); // sidebar percakapan (desktop)
  const [rightOpen, setRightOpen] = useState(true); // panel kanan (desktop)
  const [goals, setGoals] = useState([]);
  const [artifacts, setArtifacts] = useState([]);
  const [galeriFilter, setGaleriFilter] = useState("semua");
  const [pendingKategori, setPendingKategori] = useState(null);

  const openSheet = (page) => setStack((s) => [...s, page]);
  const back = () => setStack((s) => s.slice(0, -1));
  const closeSheet = () => setStack([]);
  const current = stack[stack.length - 1];

  const addGoal = (teks) => {
    setGoals((g) => [
      ...g,
      { id: Date.now(), teks, kategoriLabel: pendingKategori?.label || "" },
    ]);
    setPendingKategori(null);
    back();
  };

  const addArtefak = (nama, tipe) => {
    const t = TIPE_ARTEFAK.find((x) => x.key === tipe);
    setArtifacts((a) => [
      ...a,
      { id: Date.now(), nama, tipe, emoji: t?.emoji || "📄", tipeLabel: t?.label || tipe },
    ]);
    back();
  };

  const filteredArtifacts =
    galeriFilter === "semua"
      ? artifacts
      : galeriFilter === "file"
        ? []
        : artifacts.filter((a) => a.tipe === galeriFilter);

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
      case "sasaran-form":
        return pendingKategori ? (
          <SasaranForm kategori={pendingKategori} onSubmit={addGoal} onBack={back} />
        ) : null;
      case "artefak-form":
        return <ArtefakForm onSubmit={addArtefak} onBack={back} />;
      case "profil":
        return (
          <div className="px-2 pt-2">
            <ProfilCepirit />
          </div>
        );
      default:
        return null;
    }
  };

  // Klik avatar tengah: di layar lebar buka/tutup panel kanan,
  // di layar kecil (tanpa panel kanan) buka sheet profil
  const openProfile = () => {
    if (window.matchMedia("(min-width: 1280px)").matches) {
      setView("chat");
      setRightOpen((s) => !s);
    } else {
      openSheet("profil");
    }
  };

  const mainView =
    view === "chat" ? (
      <ChatScreen
        onOpenDrawer={() => setDrawerOpen(true)}
        onOpenMenu={() => openSheet("menu")}
        onToggleChatSide={() => setChatSide((s) => !s)}
        onOpenProfile={openProfile}
      />
    ) : view === "sasaran" ? (
      <SasaranPage
        goals={goals}
        onSelectKategori={(k) => {
          setPendingKategori(k);
          openSheet("sasaran-form");
        }}
        onDeleteGoal={(id) => setGoals((g) => g.filter((x) => x.id !== id))}
      />
    ) : (
      <GaleriPage
        artifacts={filteredArtifacts}
        filterLabel={GALERI_LABEL[galeriFilter]}
        onCreate={() => openSheet("artefak-form")}
        onDelete={(id) => setArtifacts((a) => a.filter((x) => x.id !== id))}
      />
    );

  const goView = (v) => {
    setView(v);
    if (v !== "galeri") setGaleriFilter("semua");
  };

  return (
    <div className="h-full bg-black">
      {/* ============ MOBILE (<md) ============ */}
      <div className="md:hidden h-full relative">
        {mainView}
        <Drawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          onOpenSheet={(page) => {
            setDrawerOpen(false);
            openSheet(page);
          }}
          onNavigate={(v) => {
            setDrawerOpen(false);
            goView(v);
          }}
        />
      </div>

      {/* ============ DESKTOP (md+) ============ */}
      <div className="hidden md:flex h-full">
        <IconRail
          view={view}
          onView={goView}
          onToggleChatSide={() => {
            if (view !== "chat") setView("chat");
            setChatSide((s) => !s);
          }}
          onOpenSettings={() => openSheet("settings")}
          onOpenMenu={() => openSheet("menu")}
        />

        {view === "chat" && chatSide && (
          <aside className="w-72 lg:w-80 shrink-0 h-full border-r border-white/10">
            <Drawer
              asSidebar
              open
              onClose={() => setChatSide(false)}
              onOpenSheet={(page) => openSheet(page)}
              onNavigate={goView}
            />
          </aside>
        )}

        {view === "galeri" && (
          <aside className="w-72 lg:w-80 shrink-0 h-full">
            <GaleriSidebar filter={galeriFilter} onFilter={setGaleriFilter} />
          </aside>
        )}

        <main className="flex-1 min-w-0 h-full relative">{mainView}</main>

        {view === "chat" && rightOpen && <RightPanel onClose={() => setRightOpen(false)} />}
      </div>

      {/* Sheet / modal untuk kedua mode */}
      {current && (
        <Sheet onClose={closeSheet} labelled={current !== "artefak"}>
          {renderPage()}
        </Sheet>
      )}
    </div>
  );
}
