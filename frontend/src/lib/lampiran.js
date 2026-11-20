/* Cache runtime (tidak tersimpan) buat buka file: blob URL dari File asli
   hanya hidup selama halaman ini dibuka. Data URL kecil (<=1 MB) ikut
   tersimpan di lampiran/artefak supaya tetap bisa dibuka setelah reload.
   File besar (>1 MB) tersimpan utuh di IndexedDB (lib/fileStore.js). */
import { ambilFile } from "./fileStore";

const cache = new Map();

export function simpanBlobUrl(id, url) {
  if (!id || !url) return;
  try {
    cache.set(id, url);
  } catch {}
}

export function ambilBlobUrl(id) {
  return (id && cache.get(id)) || null;
}

/* URL yang bisa dibuka untuk sebuah lampiran/artefak: blob sesi ini kalau
   ada, kalau tidak data URL yang tersimpan. */
export function urlFileLampiran(l) {
  return ambilBlobUrl(l?.id) || l?.dataUrl || null;
}

/* Versi async: blob sesi ini kalau ada, kalau tidak file asli dari
   IndexedDB (dibuatkan blob URL baru + di-cache), kalau tidak data URL
   yang tersimpan. */
export async function urlFileLampiranAsync(l) {
  if (!l) return null;
  const sesi = ambilBlobUrl(l?.id);
  if (sesi) return sesi;
  try {
    const blob = await ambilFile(l.id);
    if (blob) {
      const url = URL.createObjectURL(blob);
      simpanBlobUrl(l.id, url);
      return url;
    }
  } catch {}
  return l.dataUrl || null;
}
