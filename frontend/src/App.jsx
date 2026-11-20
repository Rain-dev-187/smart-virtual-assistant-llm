import React, { useState, useEffect } from "react";
import AuthScreen from "./components/AuthScreen";
import AvatarStudio from "./components/AvatarStudio";
import { AvatarProvider } from "./lib/avatar";
import { simpanBlobUrl } from "./lib/lampiran";
import { salinFile, hapusFile } from "./lib/fileStore";
import ChatScreen from "./components/ChatScreen";
import Drawer from "./components/Drawer";
import { MenuSheet } from "./components/SettingsMenu";
import SettingsModal from "./components/SettingsModal";
import { Artefak } from "./components/SmallScreens";
import { Sheet, SheetHeader, MobileTopBar, MobileTabBar } from "./components/ui";
import {
  IconRail,
  GaleriSidebar,
  RightPanel,
  ProfilVity,
  SearchModal,
  SasaranPage,
  GaleriPage,
  SasaranForm,
  LaporMasalahForm,
  ArtefakForm,
  GALERI_LABEL,
  TIPE_ARTEFAK,
} from "./components/Desktop";
import {
  muatObrolan,
  simpanObrolan,
  obrolanAwal,
  buatObrolanBaru,
  judulDariPesan,
  obrolanUtama,
  ACTIVE_CHAT_KEY,
  SESSION_KEY,
} from "./lib/chats";

function AppInner() {
  const [authed, setAuthed] = useState(() => {
    try {
      return (
        localStorage.getItem("vity_authed") === "1" ||
        sessionStorage.getItem("vity_authed") === "1"
      );
    } catch {
      return false;
    }
  });
  const handleAuthSuccess = (identifier, remember) => {
    try {
      if (remember) localStorage.setItem("vity_authed", "1");
      else sessionStorage.setItem("vity_authed", "1");
      localStorage.setItem("vity_user", identifier);
    } catch {}
    setAuthed(true);
  };
  const handleLogout = () => {
    try {
      localStorage.removeItem("vity_authed");
      sessionStorage.removeItem("vity_authed");
    } catch {}
    setSettingsOpen(false);
    setAuthed(false);
  };
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [stack, setStack] = useState([]); // tumpukan halaman bottom-sheet
  const [view, setView] = useState("chat"); // chat | sasaran | galeri

  /* ---------- Obrolan selingan (multi-chat) ----------
     Daftar obrolan kesimpen di localStorage; tiap obrolan punya sesi
     backend sendiri + pesan-pesannya sendiri, jadi bisa dibuka lagi
     besok (chip pemisah harinya kepakai). Obrolan pertama = obrolan
     yang selama ini dipakai, sesinya ikut pindah. */
  const [chats, setChats] = useState(() => muatObrolan() || [obrolanAwal()]);
  const [activeChatId, setActiveChatId] = useState(() => {
    try {
      return localStorage.getItem(ACTIVE_CHAT_KEY) || "";
    } catch {
      return "";
    }
  });
  const activeChat = chats.find((c) => c.id === activeChatId) || obrolanUtama(chats) || chats[0];
  useEffect(() => {
    simpanObrolan(chats);
  }, [chats]);
  useEffect(() => {
    try {
      localStorage.setItem(ACTIVE_CHAT_KEY, activeChat.id);
    } catch {}
  }, [activeChat.id]);

  /* KontrolData baca session_id dari localStorage key yang sama, jadi
     sesi obrolan aktif selalu dicerminkan ke sana. */
  const cerminkanSesi = (sessionId) => {
    try {
      localStorage.setItem(SESSION_KEY, sessionId || "");
    } catch {}
  };
  const pilihObrolan = (id) => {
    const target = chats.find((c) => c.id === id);
    if (!target) return;
    setActiveChatId(id);
    cerminkanSesi(target.sessionId);
    setView("chat");
  };
  const buatObrolan = () => {
    const baru = buatObrolanBaru();
    setChats((cs) => [baru, ...cs]);
    setActiveChatId(baru.id);
    cerminkanSesi("");
    setView("chat");
  };
  const updatePesanObrolan = (messages) => {
    setChats((cs) =>
      cs.map((c) => {
        if (c.id !== activeChat.id) return c;
        /* Judul otomatis dari pesan pertama user (selama masih "Obrolan baru"). */
        let title = c.title;
        if (title === "Obrolan baru") {
          const pertama = messages.find((m) => m.role === "user");
          if (pertama) title = judulDariPesan(pertama.text);
        }
        return { ...c, title, messages, updatedAt: Date.now() };
      })
    );
  };
  const updateSesiObrolan = (sessionId) => {
    cerminkanSesi(sessionId);
    setChats((cs) => cs.map((c) => (c.id === activeChat.id ? { ...c, sessionId } : c)));
  };
  const pinObrolan = (id) => {
    setChats((cs) => cs.map((c) => (c.id === id ? { ...c, pinned: !c.pinned } : c)));
  };
  const renameObrolan = (id, title) => {
    const t = (title || "").trim();
    if (!t) return;
    setChats((cs) => cs.map((c) => (c.id === id ? { ...c, title: t } : c)));
  };
  const arsipObrolan = (id) => {
    setChats((cs) => cs.map((c) => (c.id === id ? { ...c, archived: true } : c)));
    if (id === activeChat.id) {
      const lain = chats.find((c) => c.id !== id && !c.archived);
      if (lain) pilihObrolan(lain.id);
      else buatObrolan();
    }
  };
  const hapusObrolan = (id) => {
    const sisa = chats.filter((c) => c.id !== id);
    if (!sisa.length) {
      const baru = buatObrolanBaru();
      setChats([baru]);
      setActiveChatId(baru.id);
      cerminkanSesi("");
      setView("chat");
      return;
    }
    setChats(sisa);
    if (id === activeChat.id) {
      const pertama = sisa.find((c) => !c.archived) || sisa[0];
      pilihObrolan(pertama.id);
    }
  };
  const bukaArsip = (id) => {
    setChats((cs) => cs.map((c) => (c.id === id ? { ...c, archived: false } : c)));
    pilihObrolan(id);
  };
  const [chatSide, setChatSide] = useState(false);
  const [chatPinned, setChatPinned] = useState(() => {
    try {
      return localStorage.getItem("vity_chat_pinned") === "1";
    } catch {
      return false;
    }
  });
  const toggleChatPin = () => {
    setChatPinned((p) => {
      const next = !p;
      try {
        localStorage.setItem("vity_chat_pinned", next ? "1" : "0");
      } catch {}
      return next;
    });
  };
  const closeChatSide = () => {
    if (!chatPinned) setChatSide(false);
  };
  const sidebarOpen = chatPinned || chatSide; // sidebar percakapan (desktop)
  /* Panel kanan (profil VITY) terbuka sejak awal di desktop — seperti
     sidebar profil di Muse; di HP tetap tertutup. */
  const [rightOpen, setRightOpen] = useState(() => {
    try {
      return window.matchMedia("(min-width: 768px)").matches;
    } catch {
      return false;
    }
  });
  const [goals, setGoals] = useState([]);
  const [artifacts, setArtifacts] = useState(() => {
    try {
      const raw = localStorage.getItem("vity_artifacts");
      const arr = raw ? JSON.parse(raw) : [];
      return Array.isArray(arr) ? arr : [];
    } catch {
      return [];
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem("vity_artifacts", JSON.stringify(artifacts));
    } catch {}
  }, [artifacts]);
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

  /* dataUrl: gambar jadi thumb, dokumen kecil (<=1 MB) tersimpan supaya
     bisa dibuka lagi; blobUrl (file asli sesi ini) cuma di cache runtime,
     tidak ikut tersimpan ke localStorage. */
  const addArtefak = (nama, tipe, dataUrl, blobUrl, fileId) => {
    const t = TIPE_ARTEFAK.find((x) => x.key === tipe);
    const id = Date.now() + Math.random();
    if (blobUrl) simpanBlobUrl(id, blobUrl);
    /* File asli di IndexedDB disalin ke id artefak ini supaya artefaknya
       tetap bisa dibuka setelah reload, walau pesan chat-nya dihapus. */
    if (fileId) salinFile(fileId, id).catch(() => {});
    setArtifacts((a) => [
      ...a,
      {
        id,
        nama,
        tipe,
        emoji: t?.emoji || "📄",
        tipeLabel: t?.label || tipe,
        ...(tipe === "gambar" && dataUrl ? { thumb: dataUrl } : {}),
        ...(tipe !== "gambar" && dataUrl ? { dataUrl } : {}),
      },
    ]);
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
            onOpenAvatar={() => openSheet("avatar")}
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
        return <ArtefakForm onSubmit={(nama, tipe) => { addArtefak(nama, tipe); back(); }} onBack={back} />;
      case "profil":
        /* Tombol kembali di sini dihapus (2026-11-20): sheet HP kini maks
           80vh dengan garis geser, jadi jalan keluarnya geser ke bawah. */
        return (
          <div>
            <SheetHeader title="Profil" />
            <div className="px-2 pt-2">
              <ProfilVity onEditAvatar={() => openSheet("avatar")} />
            </div>
          </div>
        );
      case "avatar":
        return <AvatarStudio onBack={back} />;
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
        chat={activeChat}
        sessionId={activeChat.sessionId}
        onMessagesChange={updatePesanObrolan}
        onSessionIdChange={updateSesiObrolan}
        onAddArtefak={addArtefak}
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
        filter={galeriFilter}
        onFilter={setGaleriFilter}
        onCreate={() => openSheet("artefak-form")}
        onDelete={(id) => { setArtifacts((a) => a.filter((x) => x.id !== id)); hapusFile(id).catch(() => {}); }}
      />
    );

  const goView = (v) => {
    setView(v);
    if (v !== "galeri") setGaleriFilter("semua");
  };

  if (!authed) {
    return (
      <div className="h-full bg-[#171717]">
        <AuthScreen onSuccess={handleAuthSuccess} />
      </div>
    );
  }

  return (
    <div className="h-full bg-[#171717]">
      {/* ============ MOBILE (<md) ============ */}
      <div className="md:hidden h-full relative flex flex-col">
        <MobileTopBar
          onOpenDrawer={() => setDrawerOpen(true)}
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
          chats={chats}
          activeChatId={activeChat.id}
          onSelectChat={pilihObrolan}
          onCreateChat={buatObrolan}
          onPinChat={pinObrolan}
          onRenameChat={renameObrolan}
          onArchiveChat={arsipObrolan}
          onDeleteChat={hapusObrolan}
          onOpenArchived={bukaArsip}
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
              chats={chats}
              activeChatId={activeChat.id}
              onSelectChat={pilihObrolan}
              onCreateChat={buatObrolan}
              onPinChat={pinObrolan}
              onRenameChat={renameObrolan}
              onArchiveChat={arsipObrolan}
              onDeleteChat={hapusObrolan}
              onOpenArchived={bukaArsip}
            />
          </aside>
        )}

        {view === "galeri" && (
          <aside className="w-72 lg:w-80 shrink-0 h-full">
            <GaleriSidebar filter={galeriFilter} onFilter={setGaleriFilter} />
          </aside>
        )}

        <main className="flex-1 min-w-0 h-full relative">{mainView}</main>

        {view === "chat" && rightOpen && (
          <RightPanel onClose={() => setRightOpen(false)} onEditAvatar={() => openSheet("avatar")} />
        )}
      </div>

      {/* Modal pengaturan 2 kolom */}
      {settingsOpen && (
        <SettingsModal onClose={() => setSettingsOpen(false)} onLogout={handleLogout} />
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

/* AvatarProvider membungkus seluruh app (termasuk layar login)
   supaya konfigurasi avatar user berlaku global. */
export default function App() {
  return (
    <AvatarProvider>
      <AppInner />
    </AvatarProvider>
  );
}
