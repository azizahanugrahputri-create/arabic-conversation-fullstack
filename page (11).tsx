"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, MessagesSquare, Trophy, TrendingUp } from "lucide-react";
import { PageHeading } from "@/components/app-shell";

type ProgressData = { dialoguesCompleted?: number; quizzesCompleted?: number; lastQuizScore?: number; lastTopic?: string; lastPractice?: string };
type RemoteRecord = { id: string; activity_type: string; score: number; total: number; details: Record<string, unknown>; created_at: string };
const topicNames: Record<string, string> = { taaruf: "Perkenalan", school: "Sekolah", family: "Keluarga", food: "Makanan & Minuman", market: "Di Pasar" };

export default function ProgressPage() {
  const [progress, setProgress] = useState<ProgressData>({});
  const [records, setRecords] = useState<RemoteRecord[]>([]);
  const [persisted, setPersisted] = useState(false);
  useEffect(() => {
    try { setProgress(JSON.parse(localStorage.getItem("arabiyyati-progress") || "{}")); } catch { setProgress({}); }
    fetch("/api/progress").then((r) => r.ok ? r.json() : Promise.reject()).then((data) => { if (data.persisted && Array.isArray(data.progress)) { setRecords(data.progress); setPersisted(true); } }).catch(() => {});
  }, []);
  const remoteDialogues = records.filter((item) => item.activity_type === "dialogue");
  const remoteQuizzes = records.filter((item) => item.activity_type === "quiz");
  const stats = [
    { label: "Dialog selesai", value: persisted ? remoteDialogues.length : (progress.dialoguesCompleted ?? 0), icon: MessagesSquare },
    { label: "Kuis dikerjakan", value: persisted ? remoteQuizzes.length : (progress.quizzesCompleted ?? 0), icon: Trophy },
    { label: "Nilai kuis terakhir", value: persisted ? (remoteQuizzes[0] ? `${remoteQuizzes[0].score}/${remoteQuizzes[0].total}` : "—") : (progress.lastQuizScore == null ? "—" : `${progress.lastQuizScore}/8`), icon: TrendingUp },
  ];
  const lastRemote = records[0];
  return <div><PageHeading eyebrow="Perjalanan belajar" title="Lihat progresmu." description="Pantau kebiasaan latihan. Setelah masuk dengan akun, aktivitas dapat disimpan ke database dan diakses lintas perangkat." />
    <div className="grid gap-4 sm:grid-cols-3">{stats.map(({ label, value, icon: Icon }) => <div key={label} className="soft-card p-5"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-mint text-forest"><Icon size={19} /></span><p className="mt-5 text-3xl font-bold text-forest">{value}</p><p className="mt-1 text-xs text-muted">{label}</p></div>)}</div>
    <div className="mt-6 grid gap-5 lg:grid-cols-[1.1fr_.9fr]"><section className="soft-card p-6"><div className="flex items-center justify-between gap-3"><h2 className="text-lg font-bold text-forest">Aktivitas terakhir</h2><span className="pill">{persisted ? "Database" : "Perangkat ini"}</span></div><div className="mt-5 flex items-start gap-3 rounded-2xl bg-sand p-4"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-leaf"><BookOpen size={18} /></span><div className="flex-1"><p className="text-sm font-bold text-forest">{persisted && lastRemote ? (lastRemote.activity_type === "dialogue" ? `Dialog: ${String(lastRemote.details?.title ?? "Latihan percakapan")}` : lastRemote.activity_type === "quiz" ? "Kuis mufrodat" : "Latihan belajar") : progress.lastTopic ? `Tema: ${topicNames[progress.lastTopic] ?? progress.lastTopic}` : "Belum ada latihan tercatat"}</p><p className="mt-1 text-xs leading-5 text-muted">{persisted && lastRemote ? new Date(lastRemote.created_at).toLocaleString("id-ID") : progress.lastPractice ? `Latihan terakhir: ${new Date(progress.lastPractice).toLocaleString("id-ID")}` : "Selesaikan dialog atau kuis untuk mulai membangun riwayat belajar."}</p></div></div><button className="btn-secondary mt-4" onClick={() => { localStorage.removeItem("arabiyyati-progress"); setProgress({}); }}>Reset progres lokal</button></section><section className="rounded-[24px] bg-forest p-6 text-white"><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-gold"><TrendingUp size={21} /></span><h2 className="mt-5 text-xl font-bold">Konsisten lebih penting daripada terburu-buru.</h2><p className="mt-2 text-sm leading-6 text-emerald-50/75">Coba kuasai 5 kosakata, buat satu dialog, lalu ulangi percakapannya sampai terasa lebih alami.</p><Link href="/conversation" className="mt-5 inline-flex items-center gap-2 rounded-full bg-gold px-4 py-2.5 text-xs font-bold text-forest">Lanjut berlatih <ArrowRight size={14} /></Link></section></div>
    <p className="mt-5 text-[11px] leading-5 text-muted">Catatan: tanpa login, progres demo disimpan di localStorage browser ini. Progres database hanya tersedia setelah Supabase dikonfigurasi dan pengguna masuk.</p>
  </div>;
}
