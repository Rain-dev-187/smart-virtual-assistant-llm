import React, { useState } from "react";
import ChatScreen from "./components/ChatScreen";
import Drawer from "./components/Drawer";
import { MenuSheet } from "./components/SettingsMenu";
import SettingsModal from "./components/SettingsModal";
import { Artefak } from "./components/SmallScreens";
import { Sheet, MobileTopBar, MobileTabBar } from "./components/ui";
import {
  IconRail,
  GaleriSidebar,
  RightPanel,
  ProfilCepirit,
  SearchModal,
  SasaranPage,
  GaleriPage,
  SasaranForm,
  LaporMasalahForm,
  ArtefakForm,
  GALERI_LABEL,
  TIPE_ARTEFAK,
} from "./components/Desktop";

export default function App() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [stack, setStack] = useState([]); // tumpukan halaman bottom-sheet
  const [view, setView] = useState("chat"); // chat | sasaran | galeri
  const [chatSide, setChatSide] = useState(false);
  const [chatPinned, setChatPinned] = useState(() => {
    try {
      return localStorage.getItem("cepirit_chat_pinned") === "1";
    } catch {
      return false;
    }
  });
  const toggleChatPin = () => {
    setChatPinned((p) => {
      const next = !p;
      try {
        localStorage.setItem("cepirit_chat_pinned", next ? "1" : "0");
      } catch {}
      return next;
    });
  };
  const closeChatSide = () => {
    if (!chatPinned) setChatSide(false);
  };
  const sidebarOpen = chatPinned || chatSide; // sidebar percakapan (desktop)
  const [rightOpen, setRightOpen] = useState(false); // panel kanan (desktop)
  const [goals, setGoals] = useState([]);
  const [artifacts, setArtifacts] = useState([]);
  const [galeriFilter, setGaleriFilter] = useState("semua");
  const [pendingKategori, setPendingKategori] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

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
        return (
          <MenuSheet
            onClose={closeSheet}
            onOpenSettings={() => {
              closeSheet();
              setSettingsOpen(true);
            }}
            onOpenLapor={() => openSheet("lapor-form")}
          />
        );
      case "lapor-form":
        return <LaporMasalahForm onBack={back} />;
      case "artefak":
        return <Artefak {...props} />;
      case "sasaran-form":
        return pendingKategori ? (
          <SasaranForm
            kategori={pendingKategori}
            onSubmit={() => {
              setPendingKategori(null);
              back();
              goView("chat");
            }}
            onBack={back}
          />
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
        panelOpen={rightOpen}
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
    <div className="h-full bg-[#171717]">
      {/* ============ MOBILE (<md) ============ */}
      <div className="md:hidden h-full relative flex flex-col">
        <MobileTopBar
          onOpenDrawer={() => setDrawerOpen(true)}
          onOpenMenu={() => openSheet("menu")}
          onOpenProfile={openProfile}
          view={view}
        />
        <div className="flex-1 min-h-0 relative">{mainView}</div>
        <MobileTabBar view={view} onView={goView} onOpenMenu={() => openSheet("menu")} />
        <Drawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          onOpenSheet={(page) => {
            setDrawerOpen(false);
            openSheet(page);
          }}
          pinned={chatPinned}
          onTogglePin={toggleChatPin}
        />
      </div>

      {/* ============ DESKTOP (md+) ============ */}
      <div className="hidden md:flex h-full">
        <IconRail
          view={view}
          onView={goView}
          onOpenChatSide={() => {
            if (view !== "chat") {
              goView("chat");
              setChatSide(true);
            } else if (!chatPinned) {
              setChatSide((s) => !s);
            }
          }}
          onOpenSearch={() => setSearchOpen(true)}
          onOpenMenu={() => openSheet("menu")}
        />

        {view === "chat" && sidebarOpen && (
          <aside className="w-72 lg:w-80 shrink-0 h-full border-r border-white/10">
            <Drawer
              asSidebar
              open
              onClose={closeChatSide}
              onOpenSheet={(page) => openSheet(page)}
              pinned={chatPinned}
              onTogglePin={toggleChatPin}
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

      {/* Modal pengaturan 2 kolom */}
      {settingsOpen && (
        <SettingsModal
          onClose={() => setSettingsOpen(false)}
          onLogout={() => {
            setSettingsOpen(false);
            alert("Anda telah logout (demo).");
          }}
        />
      )}

      {/* Modal pencarian */}
      {searchOpen && (
        <SearchModal
          onClose={() => setSearchOpen(false)}
          onSelect={() => {
            setSearchOpen(false);
            goView("chat");
          }}
        />
      )}

      {/* Sheet / modal untuk kedua mode */}
      {current && (
        <Sheet onClose={closeSheet} labelled={current !== "artefak"}>
          {renderPage()}
        </Sheet>
      )}
    </div>
  );
}
