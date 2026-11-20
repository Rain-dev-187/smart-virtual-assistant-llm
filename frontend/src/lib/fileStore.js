/* Penyimpanan file asli di IndexedDB — supaya file besar (>1 MB) tetap bisa
   dibuka setelah tab di-reload. localStorage cuma muat data URL kecil, jadi
   byte file besar selama ini hilang begitu halaman dimuat ulang. Semua
   fungsi di sini tidak pernah melempar: kalau IndexedDB tidak tersedia
   (mis. mode privat) mereka diam-diam mengembalikan null/false. */
const DB_NAME = "vity-files";
const STORE = "files";
let dbPromise = null;

function bukaDb() {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    try {
      if (typeof indexedDB === "undefined") return reject(new Error("indexedDB tidak tersedia"));
      const req = indexedDB.open(DB_NAME, 1);
      req.onupgradeneeded = () => {
        if (!req.result.objectStoreNames.contains(STORE)) {
          req.result.createObjectStore(STORE, { keyPath: "id" });
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    } catch (e) {
      reject(e);
    }
  });
  return dbPromise;
}

function jalankan(mode, kerja) {
  return bukaDb().then(
    (db) =>
      new Promise((resolve, reject) => {
        try {
          const tx = db.transaction(STORE, mode);
          const req = kerja(tx.objectStore(STORE));
          req.onsuccess = () => resolve(req.result);
          req.onerror = () => reject(req.error);
        } catch (e) {
          reject(e);
        }
      }),
    () => null
  ).catch(() => null);
}

/* Simpan blob file asli. Dipanggil saat file dipilih (fire-and-forget). */
export function simpanFile(id, blob) {
  if (!id || !blob) return Promise.resolve(false);
  return jalankan("readwrite", (s) => s.put({ id, blob, waktu: Date.now() })).then((r) => r !== null);
}

/* Ambil blob file asli, atau null kalau belum pernah disimpan / gagal. */
export function ambilFile(id) {
  if (!id) return Promise.resolve(null);
  return jalankan("readonly", (s) => s.get(id)).then((r) => (r && r.blob) || null);
}

/* Salin blob dari satu id ke id lain (dipakai saat lampiran masuk Artefak,
   karena artefak punya id sendiri). */
export function salinFile(idLama, idBaru) {
  if (!idLama || !idBaru || idLama === idBaru) return Promise.resolve(false);
  return ambilFile(idLama).then((blob) => (blob ? simpanFile(idBaru, blob) : false));
}

/* Hapus blob file (dipakai saat artefaknya dihapus). */
export function hapusFile(id) {
  if (!id) return Promise.resolve(false);
  return jalankan("readwrite", (s) => s.delete(id)).then((r) => r !== null);
}
