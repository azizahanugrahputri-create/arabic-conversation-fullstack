"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, RotateCcw, Trophy } from "lucide-react";
import { PageHeading } from "@/components/app-shell";
import { VOCABULARY } from "@/lib/data";

function makeQuestions() {
  const pool = VOCABULARY.filter((item) => item.word_type !== "kalimat");
  return pool.slice(0, 8).map((word, index) => {
    const wrong = pool.filter((item) => item.id !== word.id).sort((a, b) => a.id.localeCompare(b.id)).slice(index % 5, (index % 5) + 3).map((item) => item.meaning_id);
    const options = [...new Set([word.meaning_id, ...wrong])].slice(0, 4).sort((a, b) => a.localeCompare(b));
    return { id: word.id, arabic: word.arabic, answer: word.meaning_id, options };
  });
}

export default function PracticePage() {
  const questions = useMemo(makeQuestions, []);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [finished, setFinished] = useState(false);
  const current = questions[index];
  const score = questions.filter((q) => answers[q.id] === q.answer).length;
  function choose(value: string) { if (!answers[current.id]) setAnswers((prev) => ({ ...prev, [current.id]: value })); }
  function next() { if (index < questions.length - 1) setIndex(index + 1); else { setFinished(true); const progress = JSON.parse(localStorage.getItem("arabiyyati-progress") || "{}"); progress.quizzesCompleted = (progress.quizzesCompleted || 0) + 1; progress.lastQuizScore = questions.filter((q) => answers[q.id] === q.answer).length; localStorage.setItem("arabiyyati-progress", JSON.stringify(progress)); fetch("/api/progress", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ activity_type: "quiz", score: progress.lastQuizScore, total: questions.length, details: { title: "Kuis mufrodat" } }) }).catch(() => {}); } }
  function restart() { setIndex(0); setAnswers({}); setFinished(false); }
  return <div><PageHeading eyebrow="Latihan mandiri" title="Uji pemahamanmu." description="Pilih arti yang paling tepat untuk setiap kosakata. Gunakan latihan ini sebagai pemanasan sebelum membuat percakapan." />
    <div className="mx-auto max-w-2xl">{!finished ? <div className="soft-card overflow-hidden"><div className="flex items-center justify-between border-b border-forest/8 px-5 py-4"><span className="text-xs font-bold text-forest">Kuis mufrodat</span><span className="text-xs text-muted">Pertanyaan {index + 1} dari {questions.length}</span></div><div className="h-1.5 bg-sand"><div className="h-full bg-leaf transition-all" style={{ width: `${((index + 1) / questions.length) * 100}%` }} /></div><div className="p-6 sm:p-9"><p className="text-center text-xs font-semibold uppercase tracking-[.15em] text-muted">Apa arti kata berikut?</p><p dir="rtl" lang="ar" className="arabic-text mt-5 text-center text-4xl font-semibold text-forest sm:text-5xl">{current.arabic}</p><div className="mt-8 grid gap-3 sm:grid-cols-2">{current.options.map((option) => { const selected = answers[current.id] === option; const correct = answers[current.id] && option === current.answer; return <button type="button" key={option} onClick={() => choose(option)} disabled={Boolean(answers[current.id])} className={`rounded-2xl border p-4 text-left text-sm font-medium transition ${correct ? "border-green-600 bg-green-50 text-green-800" : selected ? "border-red-300 bg-red-50 text-red-800" : "border-forest/10 bg-white text-ink hover:border-forest/30 hover:bg-sand"}`}>{option}{correct && <CheckCircle2 size={16} className="float-right" />}</button>; })}</div>{answers[current.id] && <div className={`mt-4 rounded-xl p-3 text-xs ${answers[current.id] === current.answer ? "bg-green-50 text-green-800" : "bg-amber-50 text-amber-800"}`}>{answers[current.id] === current.answer ? "Tepat! Kamu memilih arti yang benar." : `Belum tepat. Arti yang benar: ${current.answer}`}</div>}<div className="mt-7 flex justify-end"><button type="button" onClick={next} disabled={!answers[current.id]} className="btn-primary disabled:cursor-not-allowed disabled:opacity-40">{index === questions.length - 1 ? "Lihat hasil" : "Pertanyaan berikutnya"}<ArrowRight size={15} /></button></div></div></div> : <div className="soft-card p-7 text-center sm:p-10"><span className="mx-auto flex h-16 w-16 items-center justify-center rounded-[22px] bg-mint text-forest"><Trophy size={28} /></span><p className="mt-5 text-xs font-bold uppercase tracking-[.17em] text-leaf">Latihan selesai</p><h2 className="mt-2 text-3xl font-bold text-forest">{score} dari {questions.length}</h2><p className="mt-3 text-sm leading-6 text-muted">{score >= 6 ? "Bagus! Kamu sudah memahami banyak kosakata. Coba gunakan kata-kata ini dalam percakapan." : "Terus berlatih. Buka kembali perpustakaan mufrodat, lalu coba kuis ini lagi."}</p><div className="mt-6 flex flex-wrap justify-center gap-3"><button onClick={restart} className="btn-secondary"><RotateCcw size={15} /> Ulangi kuis</button><Link href="/conversation" className="btn-primary">Buat percakapan <ArrowRight size={15} /></Link></div></div>}</div>
  </div>;
}
