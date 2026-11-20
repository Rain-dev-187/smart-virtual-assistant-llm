/* ---------- Tema warna chat ----------
   Warna aksen VITY (bubble sendiri, tombol, tautan) mengikuti pilihan di
   Pengaturan > Umum > Warna tema. Disimpan di localStorage dan dipakai
   sebagai CSS variable, jadi Tailwind `accent` mengikutinya.
   Warna teks di atas aksen ikut dihitung: aksen terang (mis. Krem) pakai
   teks gelap, aksen gelap pakai teks putih. */

export const THEME_KEY = "vity_theme";
export const DEFAULT_ACCENT = "#0a84ff";

export function getTheme() {
  try {
    return localStorage.getItem(THEME_KEY) || DEFAULT_ACCENT;
  } catch {
    return DEFAULT_ACCENT;
  }
}

/* Terang atau tidak, dari rumus kecerahan (0-255). */
export function warnaTerang(hex) {
  const h = (hex || "").replace("#", "");
  if (h.length !== 6) return false;
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return 0.299 * r + 0.587 * g + 0.114 * b > 150;
}

export function applyTheme(hex = getTheme()) {
  try {
    document.documentElement.style.setProperty("--vity-accent", hex);
    document.documentElement.style.setProperty(
      "--vity-on-accent",
      warnaTerang(hex) ? "#1c1c1e" : "#ffffff"
    );
  } catch {}
}

export function setTheme(hex) {
  try {
    localStorage.setItem(THEME_KEY, hex);
  } catch {}
  applyTheme(hex);
}
