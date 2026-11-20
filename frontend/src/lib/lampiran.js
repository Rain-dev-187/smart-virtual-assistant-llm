/* Cache runtime (tidak tersimpan) buat buka file: blob URL dari File asli
   hanya hidup selama halaman ini dibuka. Data URL kecil (<=1 MB) ikut
   tersimpan di lampiran/artefak supaya tetap bisa dibuka setelah reload. */
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

/* Buka file non-gambar: pakai blob sesi ini kalau ada, kalau tidak pakai
   data URL yang tersimpan. Mengembalikan false kalau tidak ada yang bisa dibuka. */
export function bukaFileLampiran(l) {
  const url = urlFileLampiran(l);
  if (!url) return false;
  window.open(url, "_blank");
  return true;
}
