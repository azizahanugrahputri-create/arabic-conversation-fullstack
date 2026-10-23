"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, LogIn, Plus, ShieldCheck, Trash2 } from "lucide-react";
import { PageHeading } from "@/components/app-shell";
import { TOPICS, VOCABULARY } from "@/lib/data";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import type { Vocabulary } from "@/lib/types";

export default function AdminPage() {
  const [words, setWords] = useState<Vocabulary[]>(VOCABULARY);
  const [userEmail, setUserEmail] = useState("");
  const [role, setRole] = useState("");
  const [configured, setConfigured] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [arabic, setArabic] = useState("");
  const [transliteration, setTransliteration] = useState("");
  const [meaning, setMeaning] = useState("");
  const [topicSlug, setTopicSlug] = useState("taaruf");
  const [wordType, setWordType] = useState("isim");
  const [level, setLevel] = useState("A1");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    setConfigured(Boolean(supabase));
    if (!supabase) { setLoading(false); return; }
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) { setLoading(false); return; }
      setUserEmail(data.user.email ?? "");
      const { data: profile } = await supabase.from("profiles").select("role").eq("id", data.user.id).maybeSingle();
      setRole(profile?.role ?? "student");
      try { const res = await fetch("/api/vocabulary"); const payload = await res.json(); if (Array.isArray(payload.vocabulary)) setWords(payload.vocabulary); } catch {}
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  async function addWord(event: FormEvent) {
    event.preventDefault(); setBusy(true); setMessage("");
    try {
      const response = await fetch("/api/admin/vocabulary", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ arabic, transliteration, meaning_id: meaning, topicSlug, word_type: wordType, level, grammar_tags: [] }) });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Tidak dapat menambahkan kosakata.");
      setWords((prev) => [payload.vocabulary, ...prev]); setArabic(""); setTransliteration(""); setMeaning(""); setMessage("Kosakata berhasil disimpan ke Supabase.");
    } catch (e) { setMessage(e instanceof Error ? e.message : "Terjadi kesalahan."); }
    finally { setBusy(false); }
  }
  async function deleteWord(id: string) {
    if (!window.confirm("Hapus kosakata ini dari database?")) return;
    const response = await fetch(`/api/admin/vocabulary/${id}`, { method: "DELETE" }); const payload = await response.json();
    if (!response.ok) { setMessage(payload.error || "Tidak dapat menghapus kosakata."); return; }
    setWords((prev) => prev.filter((item) => item.id !== id)); setMessage("Kosakata dihapus.");
  }

  if (loading) return <div><PageHeading eyebrow="Area pengelolaan" title="Dashboard guru." description="Memeriksa sesi dan akses akun..." /><div className="soft-card p-8 text-sm text-muted">Memuat status akun.</div></div>;
  if (!configured || !userEmail) return <div><PageHeading eyebrow="Area pengelolaan" title="Dashboard guru." description="Kelola kosakata dan materi pembelajaran Arabiyyati." /><div className="soft-card max-w-2xl p-7"><span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-mint text-forest"><ShieldCheck size={22} /></span><h2 className="mt-5 text-xl font-bold text-forest">{!configured ? "Hubungkan Supabase terlebih dahulu" : "Masuk untuk melanjutkan"}</h2><p className="mt-2 text-sm leading-6 text-muted">{!configured ? "Tambahkan URL dan anon key Supabase di .env.local, lalu jalankan SQL schema yang disertakan dalam proyek." : "Dashboard ini hanya dapat digunakan setelah masuk dengan akun guru atau admin."}</p><div className="mt-5 flex flex-wrap gap-3"><Link href="/login" className="btn-primary"><LogIn size={15} /> Masuk / Daftar</Link><Link href="/mufrodat" className="btn-secondary"><BookOpen size={15} /> Lihat materi</Link></div></div></div>;
  if (!["admin", "teacher"].includes(role)) return <div><PageHeading eyebrow="Area pengelolaan" title="Akses belum diberikan." description="Akunmu terdaftar, tetapi peran saat ini belum memiliki izin mengelola materi." /><div className="soft-card max-w-2xl p-7"><p className="text-sm text-muted">Akun: <strong className="text-forest">{userEmail}</strong></p><p className="mt-2 text-sm text-muted">Peran saat ini: <strong className="text-forest">{role || "student"}</strong>. Minta pemilik proyek mengubah peran akun menjadi `teacher` atau `admin` pada tabel `profiles` di Supabase.</p><Link href="/" className="btn-secondary mt-5">Kembali ke beranda</Link></div></div>;

  return <div><PageHeading eyebrow="Area pengelolaan" title="Kelola materi belajar." description="Tambahkan kosakata ke database Supabase. Perubahan yang disimpan akan tersedia bagi semua pengguna aplikasi." /><div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-forest/10 bg-white px-4 py-3"><div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-mint text-forest"><ShieldCheck size={18} /></span><div><p className="text-sm font-bold text-forest">{userEmail}</p><p className="text-[11px] text-muted">Peran: {role}</p></div></div><button className="btn-secondary" onClick={async () => { await createSupabaseBrowserClient()?.auth.signOut(); window.location.href = "/login"; }}>Keluar</button></div>
    <div className="grid items-start gap-6 lg:grid-cols-[.85fr_1.15fr]"><form onSubmit={addWord} className="soft-card p-5 sm:p-6"><h2 className="flex items-center gap-2 text-lg font-bold text-forest"><Plus size={18} /> Tambah mufrodat</h2><p className="mb-5 mt-1 text-xs leading-5 text-muted">Isi kata Arab, transliterasi, arti, dan tema.</p><div className="space-y-4"><div><label className="label" htmlFor="arabic">Tulisan Arab</label><input id="arabic" required value={arabic} onChange={(e) => setArabic(e.target.value)} className="field arabic-text text-right text-xl" dir="rtl" lang="ar" placeholder="مَثَلٌ" /></div><div><label className="label" htmlFor="transliteration">Transliterasi</label><input id="transliteration" required value={transliteration} onChange={(e) => setTransliteration(e.target.value)} className="field" placeholder="mathalun" /></div><div><label className="label" htmlFor="meaning">Arti bahasa Indonesia</label><input id="meaning" required value={meaning} onChange={(e) => setMeaning(e.target.value)} className="field" placeholder="Contoh / perumpamaan" /></div><div><label className="label" htmlFor="topic">Tema</label><select id="topic" value={topicSlug} onChange={(e) => setTopicSlug(e.target.value)} className="field">{TOPICS.map((topic) => <option key={topic.slug} value={topic.slug}>{topic.title}</option>)}</select></div><div className="grid grid-cols-2 gap-3"><div><label className="label" htmlFor="type">Jenis kata</label><select id="type" value={wordType} onChange={(e) => setWordType(e.target.value)} className="field"><option value="isim">Isim</option><option value="fi'il">Fi'il</option><option value="huruf">Huruf</option><option value="ungkapan">Ungkapan</option><option value="kalimat">Kalimat</option></select></div><div><label className="label" htmlFor="level">Level</label><select id="level" value={level} onChange={(e) => setLevel(e.target.value)} className="field"><option>A1</option><option>A2</option><option>B1</option><option>B2</option></select></div></div>{message && <p role="status" className="rounded-xl bg-sand p-3 text-xs leading-5 text-muted">{message}</p>}<button disabled={busy} className="btn-primary w-full disabled:opacity-50" type="submit">{busy ? "Menyimpan..." : "Simpan kosakata"}<Plus size={15} /></button></div></form>
      <section className="soft-card overflow-hidden"><div className="flex items-center justify-between border-b border-forest/8 px-5 py-4"><div><h2 className="font-bold text-forest">Daftar kosakata</h2><p className="mt-1 text-xs text-muted">{words.length} entri yang tampil</p></div><span className="pill">Supabase</span></div><div className="max-h-[720px] divide-y divide-forest/8 overflow-y-auto">{words.map((word) => <div key={word.id} className="flex items-center gap-3 px-4 py-3.5"><div className="min-w-0 flex-1"><p dir="rtl" lang="ar" className="arabic-text text-right text-xl text-forest">{word.arabic}</p><p className="mt-1 truncate text-xs text-muted">{word.meaning_id} · {TOPICS.find((topic) => topic.slug === word.topicSlug)?.title ?? word.topicSlug}</p></div><button type="button" title="Hapus kosakata" onClick={() => deleteWord(word.id)} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted transition hover:bg-red-50 hover:text-red-700"><Trash2 size={16} /></button></div>)}</div></section>
    </div>
  </div>;
}
