"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, BookOpen, LockKeyhole, Mail } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const supabaseConfigured = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  async function submit(event: FormEvent) {
    event.preventDefault(); setMessage("");
    const supabase = createSupabaseBrowserClient();
    if (!supabase) { setMessage("Supabase belum dikonfigurasi. Isi variabel di .env.local terlebih dahulu."); return; }
    setBusy(true);
    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push("/admin"); router.refresh();
      } else {
        const { error } = await supabase.auth.signUp({ email, password, options: { data: { full_name: email.split("@")[0] } } });
        if (error) throw error;
        setMessage("Pendaftaran berhasil dikirim. Jika konfirmasi email aktif, buka email untuk memverifikasi akun sebelum masuk.");
      }
    } catch (e) { setMessage(e instanceof Error ? e.message : "Terjadi kesalahan saat autentikasi."); }
    finally { setBusy(false); }
  }
  return <div className="mx-auto grid max-w-4xl overflow-hidden rounded-[28px] bg-white shadow-soft md:grid-cols-2"><div className="relative overflow-hidden bg-forest p-7 text-white sm:p-10"><div className="absolute -right-10 -top-10 h-48 w-48 rounded-full border border-white/10" /><span className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-gold"><BookOpen size={23} /></span><h1 className="relative mt-8 text-3xl font-bold leading-tight">Selamat datang di<br /><span className="text-gold">Arabiyyati.</span></h1><p className="relative mt-4 text-sm leading-7 text-emerald-50/75">Masuk untuk mengelola materi pembelajaran. Akun baru akan menjadi siswa sampai guru/admin memberikan akses khusus.</p><p dir="rtl" lang="ar" className="arabic-text relative mt-10 text-right text-3xl text-white/90">طَرِيقُكَ إِلَى الْعَرَبِيَّةِ</p><p className="relative mt-1 text-xs text-emerald-50/60">Langkahmu menuju bahasa Arab.</p></div><div className="p-7 sm:p-10"><Link href="/" className="inline-flex items-center gap-1 text-xs font-semibold text-muted hover:text-forest"><ArrowLeft size={14} /> Kembali ke beranda</Link><h2 className="mt-7 text-2xl font-bold text-forest">{mode === "login" ? "Masuk akun" : "Buat akun"}</h2><p className="mt-2 text-sm text-muted">{mode === "login" ? "Gunakan email dan kata sandi yang terdaftar." : "Buat akun untuk memulai pengalaman belajar."}</p>
      {!supabaseConfigured && <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-800">Mode demo aktif. Login membutuhkan proyek Supabase dan variabel lingkungan yang valid.</div>}
      <form onSubmit={submit} className="mt-6 space-y-4"><div><label className="label" htmlFor="email">Email</label><div className="relative"><Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" /><input id="email" className="field pl-10" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="nama@email.com" /></div></div><div><label className="label" htmlFor="password">Kata sandi</label><div className="relative"><LockKeyhole size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" /><input id="password" className="field pl-10" type="password" minLength={6} autoComplete={mode === "login" ? "current-password" : "new-password"} required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Minimal 6 karakter" /></div></div>{message && <p role="status" className="rounded-xl bg-sand p-3 text-xs leading-5 text-muted">{message}</p>}<button className="btn-primary w-full" type="submit" disabled={busy}>{busy ? "Memproses..." : mode === "login" ? "Masuk" : "Daftar"}</button></form><p className="mt-5 text-center text-xs text-muted">{mode === "login" ? "Belum punya akun?" : "Sudah punya akun?"} <button onClick={() => { setMode(mode === "login" ? "signup" : "login"); setMessage(""); }} className="font-bold text-leaf">{mode === "login" ? "Daftar" : "Masuk"}</button></p>
    </div></div>;
}
