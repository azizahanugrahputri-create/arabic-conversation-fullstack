"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, SlidersHorizontal, Volume2, BookOpen } from "lucide-react";
import { PageHeading, ArabicText } from "@/components/app-shell";
import { SpeechButton } from "@/components/speech-button";
import { TOPICS, VOCABULARY } from "@/lib/data";
import type { Vocabulary } from "@/lib/types";

export default function MufrodatPage() {
  const [words, setWords] = useState<Vocabulary[]>(VOCABULARY);
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState("all");
  const [loading, setLoading] = useState(true);
  useEffect(() => { fetch("/api/vocabulary").then((r) => r.ok ? r.json() : Promise.reject()).then((data) => { if (Array.isArray(data.vocabulary)) setWords(data.vocabulary); }).catch(() => {}).finally(() => setLoading(false)); }, []);
  const filtered = useMemo(() => words.filter((word) => (topic === "all" || word.topicSlug === topic) && `${word.arabic} ${word.transliteration} ${word.meaning_id}`.toLowerCase().includes(query.toLowerCase())), [words, topic, query]);
  return <div><PageHeading eyebrow="Perpustakaan kosakata" title="Jelajahi mufrodat." description="Pelajari kata dan ungkapan bahasa Arab berdasarkan tema. Dengarkan pelafalan, pahami artinya, lalu gunakan dalam percakapan." />
    <div className="soft-card mb-6 p-4 sm:p-5"><div className="flex flex-col gap-3 md:flex-row"><div className="relative flex-1"><Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Cari kata Arab, transliterasi, atau arti..." className="field pl-11" /></div><div className="relative md:w-64"><SlidersHorizontal size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" /><select value={topic} onChange={(e) => setTopic(e.target.value)} className="field appearance-none pl-10"><option value="all">Semua tema</option>{TOPICS.map((item) => <option value={item.slug} key={item.slug}>{item.title}</option>)}</select></div></div><div className="mt-4 flex items-center justify-between text-xs text-muted"><span>{loading ? "Memuat data..." : `${filtered.length} kosakata ditemukan`}</span><span className="flex items-center gap-1"><BookOpen size={14} /> Materi tingkat dasar</span></div></div>
    {filtered.length === 0 ? <div className="soft-card p-10 text-center"><p className="font-bold text-forest">Kosakata tidak ditemukan</p><p className="mt-2 text-sm text-muted">Coba kata kunci atau tema yang berbeda.</p></div> : <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{filtered.map((word) => { const wordTopic = TOPICS.find((item) => item.slug === word.topicSlug); return <article key={word.id} className="soft-card p-5 transition hover:-translate-y-0.5"><div className="flex items-start justify-between gap-3"><span className="pill">{wordTopic?.title ?? word.topicSlug}</span><SpeechButton text={word.arabic} /></div><ArabicText className="mt-4 block text-right text-[30px] font-semibold text-forest">{word.arabic}</ArabicText><p className="mt-1 text-xs font-medium tracking-wide text-leaf">{word.transliteration}</p><h2 className="mt-3 text-sm font-bold text-ink">{word.meaning_id}</h2><div className="mt-4 flex items-center justify-between border-t border-forest/8 pt-3 text-[10px] text-muted"><span>{word.word_type}</span><span>{word.level}</span></div></article>; })}</div>}
  </div>;
}
