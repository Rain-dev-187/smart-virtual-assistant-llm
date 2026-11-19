import React, { useEffect, useRef, useState } from "react";
import { CepiritAvatar } from "./ui";

/* ================================================================
   Layar Login / Register ala Muse (passwordless, kode OTP):
   1) "identitas"  : input nomor ponsel / email -> Lanjut
   2) "otp-login"  : 6 kotak kode (akun sudah terdaftar)
   3) "otp-daftar" : konfirmasi akun baru (satu field kode)
   Belum ada backend: kode dibuat lokal & ditampilkan sebagai
   petunjuk demo supaya flow-nya bisa dicoba sampai masuk.
   ================================================================ */

const LS_ACCOUNTS = "cepirit_accounts";

function loadAccounts() {
  try {
    return JSON.parse(localStorage.getItem(LS_ACCOUNTS) || "[]");
  } catch {
    return [];
  }
}

function isValidId(v) {
  const t = v.trim();
  if (/\S+@\S+\.\S+/.test(t)) return true; // email
  const digits = t.replace(/[^\d]/g, "");
  return digits.length >= 9 && /^\+?[\d\s-]+$/.test(t); // nomor ponsel
}

function maskId(id) {
  const t = id.trim();
  if (t.includes("@")) {
    const [user, domain] = t.split("@");
    if (user.length <= 2) return `${user[0]}*****@${domain}`;
    return `${user[0]}*****${user[user.length - 1]}@${domain}`;
  }
  const d = t.replace(/[^\d]/g, "");
  return `${d.slice(0, 3)}*****${d.slice(-2)}`;
}

function genCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

/* ---------- 6 kotak OTP ---------- */
function OtpBoxes({ value, onChange, error }) {
  const refs = useRef([]);
  const digits = value.padEnd(6, " ").slice(0, 6).split("");

  const setDigit = (i, d) => {
    const next = value.split("");
    next[i] = d;
    onChange(next.join("").slice(0, 6));
  };

  return (
    <div className="flex justify-center gap-2 sm:gap-2.5">
      {digits.map((d, i) => (
        <input
          key={i}
          ref={(el) => (refs.current[i] = el)}
          value={d.trim()}
          inputMode="numeric"
          autoComplete={i === 0 ? "one-time-code" : "off"}
          onChange={(e) => {
            const v = e.target.value.replace(/\D/g, "");
            if (!v) {
              setDigit(i, "");
              return;
            }
            if (v.length > 1) {
              // tempel kode penuh
              onChange(v.slice(0, 6));
              refs.current[Math.min(v.length, 5)]?.focus();
              return;
            }
            setDigit(i, v);
            if (i < 5) refs.current[i + 1]?.focus();
          }}
          onKeyDown={(e) => {
            if (e.key === "Backspace" && !digits[i].trim() && i > 0) {
              refs.current[i - 1]?.focus();
            }
          }}
          onFocus={(e) => e.target.select()}
          className={`w-11 h-12 sm:w-[52px] sm:h-14 rounded-2xl bg-card2 text-center text-xl font-semibold outline-none border transition-colors ${
            error
              ? "border-danger/70"
              : "border-transparent focus:border-accent"
          }`}
        />
      ))}
    </div>
  );
}

/* ---------- Layar utama ---------- */
export default function AuthScreen({ onSuccess }) {
  const [step, setStep] = useState("identitas"); // identitas | otp-login | otp-daftar
  const [identifier, setIdentifier] = useState("");
  const [code, setCode] = useState("");
  const [sentCode, setSentCode] = useState("");
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [sending, setSending] = useState(false); // kode sedang "dikirim" (avatar working)

  const isRegistered = loadAccounts().includes(identifier.trim());

  const sendCode = (targetStep) => {
    const c = genCode();
    setSentCode(c);
    setCode("");
    setError("");
    setNotice("");
    setStep(targetStep);
  };

  const submitIdentifier = () => {
    if (sending) return;
    if (!isValidId(identifier)) {
      setError("Masukkan email yang valid atau nomor ponsel (min. 9 digit).");
      return;
    }
    setError("");
    /* Simulasi pengiriman kode: avatar beranimasi "working" selama progress */
    setSending(true);
    setTimeout(() => {
      setSending(false);
      sendCode(isRegistered ? "otp-login" : "otp-daftar");
    }, 900);
  };

  const resend = () => {
    const c = genCode();
    setSentCode(c);
    setCode("");
    setError("");
    setNotice("Kode baru sudah dikirim.");
  };

  const verify = () => {
    if (code !== sentCode) {
      setError("Kode salah. Coba lagi ya.");
      setCode("");
      return;
    }
    const id = identifier.trim();
    if (step === "otp-daftar") {
      const acc = loadAccounts();
      if (!acc.includes(id)) {
        acc.push(id);
        try {
          localStorage.setItem(LS_ACCOUNTS, JSON.stringify(acc));
        } catch {}
      }
    }
    onSuccess(id, remember);
  };

  const back = () => {
    setStep("identitas");
    setCode("");
    setError("");
    setNotice("");
  };

  const canVerify = code.length === 6;

  return (
    <div className="h-full overflow-y-auto bg-[#171717] text-white">
      <div className="min-h-full flex flex-col items-center px-5 py-6 sm:px-8">
        {/* ---------- STEP 1: identitas ---------- */}
        {step === "identitas" && (
          <div className="w-full max-w-[430px] flex-1 flex flex-col">
            <div className="flex-1 flex flex-col items-center justify-center text-center pt-6 pb-10">
              <div className="animate-pop-in mb-7">
                <CepiritAvatar size={76} label={false} state={sending ? "working" : "idle"} />
              </div>
              <h1 className="text-[32px] leading-[1.15] sm:text-[38px] font-semibold tracking-tight">
                CEPIRIT, asisten AI
                <br />
                pribadi Anda
              </h1>
              <p className="mt-6 text-white/50 text-[15px]">Login atau buat akun</p>

              <div className="w-full mt-5">
                <input
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && submitIdentifier()}
                  placeholder="Nomor ponsel atau email"
                  autoComplete="username"
                  className="w-full h-14 rounded-full bg-card2 px-6 text-[16px] placeholder:text-white/35 outline-none border border-transparent focus:border-accent/60 transition-colors"
                />
                {error && <p className="mt-3 text-sm text-danger">{error}</p>}
                <p className="mt-4 text-[13px] leading-relaxed text-white/40 px-2">
                  Kode login akan kami kirim ke nomor ponsel atau email Anda.{" "}
                  <span className="text-accent">Pelajari selengkapnya</span>
                </p>
                <button
                  onClick={submitIdentifier}
                  disabled={sending}
                  className="mt-6 w-full h-14 rounded-full bg-accent text-white text-[16px] font-medium active:scale-[0.99] transition-transform disabled:opacity-60"
                >
                  {sending ? "Mengirim kode…" : "Lanjut"}
                </button>
                {sending && (
                  <div className="mt-4 h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full w-1/3 rounded-full bg-accent progress-slide" />
                  </div>
                )}
              </div>
            </div>
            <p className="text-center text-[12px] text-white/30 pb-2">
              Cepet Lancar Dan Plong
            </p>
          </div>
        )}

        {/* ---------- STEP 2 & 3: OTP ---------- */}
        {step !== "identitas" && (
          <div className="w-full max-w-[430px] flex-1 flex flex-col">
            <div className="flex items-center">
              <button
                onClick={back}
                aria-label="Kembali"
                className="w-11 h-11 rounded-full bg-card2 flex items-center justify-center text-xl leading-none active:scale-95 transition-transform"
              >
                &#8592;
              </button>
            </div>

            <div className="flex-1 flex flex-col items-center text-center pt-8">
              <div className="animate-pop-in">
                <CepiritAvatar size={64} label={false} />
              </div>

              {step === "otp-login" ? (
                <>
                  <h2 className="mt-6 text-[26px] sm:text-[28px] font-semibold">
                    Masukkan kode Anda
                  </h2>
                  <p className="mt-4 text-white/50 text-[15px] leading-relaxed max-w-[340px]">
                    Untuk login, masukkan kode yang kami kirim ke{" "}
                    <span className="text-white/80">{identifier.trim()}</span>.{" "}
                    <button onClick={resend} className="text-accent">
                      Resend code
                    </button>
                  </p>
                  <div className="mt-7">
                    <OtpBoxes value={code} onChange={setCode} error={!!error} />
                  </div>
                  {error && <p className="mt-4 text-sm text-danger">{error}</p>}
                  {notice && <p className="mt-4 text-sm text-white/50">{notice}</p>}

                  <label className="mt-7 flex items-center gap-3 cursor-pointer select-none">
                    <span
                      onClick={(e) => {
                        e.preventDefault();
                        setRemember((r) => !r);
                      }}
                      className={`w-6 h-6 rounded-md flex items-center justify-center text-sm transition-colors ${
                        remember ? "bg-accent text-white" : "bg-card2 text-transparent"
                      }`}
                    >
                      &#10003;
                    </span>
                    <span className="text-[15px]">Ingat perangkat ini</span>
                  </label>

                  <button
                    onClick={verify}
                    disabled={!canVerify}
                    className={`mt-8 w-full max-w-[430px] h-14 rounded-full text-[16px] font-medium transition-all ${
                      canVerify
                        ? "bg-accent text-white active:scale-[0.99]"
                        : "bg-accent/30 text-white/40"
                    }`}
                  >
                    Berikutnya
                  </button>
                  <button onClick={back} className="mt-6 text-accent text-[15px]">
                    Coba cara lain
                  </button>
                </>
              ) : (
                <>
                  <h2 className="mt-6 text-[26px] sm:text-[28px] font-semibold">
                    Konfirmasikan akun Anda
                  </h2>
                  <p className="mt-4 text-white/50 text-[15px] leading-relaxed max-w-[340px]">
                    Kami mengirim kode ke{" "}
                    <span className="text-white/80">{maskId(identifier)}</span>.
                    Masukkan kode tersebut untuk mengonfirmasi akun Anda.
                  </p>
                  <input
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    onKeyDown={(e) => e.key === "Enter" && canVerify && verify()}
                    placeholder="Kode"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    className={`mt-7 w-full h-14 rounded-full bg-black/50 px-6 text-[17px] tracking-[0.35em] placeholder:tracking-normal placeholder:text-white/35 outline-none border transition-colors ${
                      error ? "border-danger/70" : "border-white/10 focus:border-accent/60"
                    }`}
                  />
                  {error && <p className="mt-4 text-sm text-danger">{error}</p>}
                  {notice && <p className="mt-4 text-sm text-white/50">{notice}</p>}
                  <button
                    onClick={verify}
                    disabled={!canVerify}
                    className={`mt-6 w-full h-14 rounded-full text-[16px] font-medium transition-all ${
                      canVerify
                        ? "bg-accent text-white active:scale-[0.99]"
                        : "bg-accent/30 text-white/40"
                    }`}
                  >
                    Berikutnya
                  </button>
                  <button onClick={resend} className="mt-6 text-[15px] text-white/85">
                    Kirim ulang kode
                  </button>
                </>
              )}

              {/* Petunjuk demo: belum ada backend pengirim kode */}
              {sentCode && (
                <div className="mt-10 px-4 py-2.5 rounded-full bg-card border border-white/10 text-[13px] text-white/60">
                  Demo &mdash; kode Anda:{" "}
                  <span className="text-white font-semibold tracking-widest">{sentCode}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
