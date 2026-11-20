/* Berbagi gambar: unggah ke Google Drive lewat backend, lalu salin link
   publiknya. Backend menjawab 503 kalau Drive belum disetup di laptop
   (butuh backend/service-account.json) — tidak ada file yang terunggah
   sebelum setup itu selesai dan user mengetuk Salin link / WhatsApp. */

const API_URL = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
const API_KEY = import.meta.env.VITE_API_KEY || "";

function headers() {
  const h = {};
  if (API_KEY) h["X-API-Key"] = API_KEY;
  return h;
}

/* POST gambar ke /api/share. Kembalikan link publiknya, atau throw dengan
   pesan backend (mis. Drive belum disetup). */
export async function unggahUntukDibagikan(blob, nama) {
  const form = new FormData();
  form.append("file", blob, nama || "gambar");
  const res = await fetch(`${API_URL}/api/share`, {
    method: "POST",
    headers: headers(),
    body: form,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.detail || `Gagal mengunggah (${res.status}).`);
  if (!data.url) throw new Error("Backend tidak mengembalikan link.");
  return data.url;
}

/* Salin teks. navigator.clipboard cuma ada di konteks aman (https), jadi di
   http LAN pakai fallback textarea + execCommand — jalan di iOS Safari
   selama dipanggil dari ketukan user. */
export async function salinTeks(teks) {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(teks);
      return true;
    }
  } catch {
    /* jatuh ke fallback di bawah */
  }
  try {
    const ta = document.createElement("textarea");
    ta.value = teks;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    ta.remove();
    return ok;
  } catch {
    return false;
  }
}
