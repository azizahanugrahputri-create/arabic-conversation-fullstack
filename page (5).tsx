"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Check, CirclePlay, RotateCcw, Sparkles, WandSparkles } from "lucide-react";
import { PageHeading, ArabicText } from "@/components/app-shell";
import { SpeechButton } from "@/components/speech-button";
import { TOPICS, VOCABULARY } from "@/lib/data";
import type { GeneratedDialogue, Topic, Vocabulary } from "@/lib/types";

export default function ConversationPage() {
  const [topics, setTopics] = useState<Topic[]>(TOPICS);
  const [words, setWords] = useState<Vocabulary[]>(VOCABULARY);
  const [topicSlug, setTopicSlug] = useState("taaruf");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [dialogue, setDialogue] = useState<GeneratedDialogue | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => { fetch("/api/topics").then((r) => r.ok ? r.json() : Promise.reject()).then((data) => { if (Array.isArray(data.topics) && data.topics.length) setTopics(data.topics); }).catch(() => {}); fetch("/api/vocabulary").then((r) => r.ok ? r.json() : Promise.reject()).then((data) => { if (Array.isArray(data.vocabulary) && data.vocabulary.length) setWords(data.vocabulary); }).catch(() => {}); }, []);
  useEffect(() => { const param = new URLSearchParams(window.location.search).get("topic"); if (param && TOPICS.some((t) => t.slug === param)) setTopicSlug(param); }, []);
  const topicWords = useMemo(() => words.filter((word) => word.topicSlug === topicSlug), [words, topicSlug]);
  function changeTopic(value: string) { setTopicSlug(value); setSelectedIds([]); setDialogue(null); setError(""); }
  function toggleWord(id: string) { setSelectedIds((current) => current.includes(id) ? current.filter((item) => item !== id) : current.length < 5 ? [...current, id] : current); }
  async function createDialogue() {
    setLoading(true); setError("");
    try {
      const response = await fetch("/api/dialogues/generate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ topicSlug, vocabularyIds: selectedIds }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Percakapan belum dapat dibuat.");
      setDialogue(data.dialogue);
    } catch (e) { setError(e instanceof Error ? e.message : "Terjadi kesalahan."); }
    finally { setLoading(false); }
  }
  function savePractice() {
    const current = JSON.parse(localStorage.getItem("arabiyyati-progress") || "{}");
    current.dialoguesCompleted = (current.dialoguesCompleted || 0) + 1;
    current.lastTopic = topicSlug;
    current.lastPractice = new Date().toISOString();
    localStorage.setItem("arabiyyati-progress", JSON.stringify(current));
    fetch("/api/progress", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ activity_type: "dialogue", score: 1, total: 1, details: { topic: topicSlug, title: dialogue?.title } }) }).catch(() => {});
    window.alert("Latihan dicatat di progres perangkat ini. Terus berlatih!");
  }

  return <div><PageHeading eyebrow="Conversation builder" title="Rangkai mufrodat menjadi dialog." description="Pilih tema dan maksimal lima kosakata. Sistem akan menyusun percakapan dari pola yang telah disiapkan agar kamu bisa langsung berlatih." />
    <div className="grid items-start gap-6 lg:grid-cols-[.85fr_1.15fr]">
      <section className="soft-card p-5 sm:p-6"><div className="mb-5 flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-mint text-forest"><WandSparkles size={20} /></span><div><h2 className="font-bold text-forest">Atur latihanmu</h2><p className="mt-1 text-xs text-muted">Langkah 1 · Pilih tema dan kata</p></div></div>
        <label className="label" htmlFor="topic">Tema percakapan</label><select id="topic" className="field" value={topicSlug} onChange={(e) => changeTopic(e.target.value)}>{topics.map((topic) => <option key={topic.slug} value={topic.slug}>{topic.title} — {topic.title_ar}</option>)}</select>
        <div className="mt-5 flex items-center justify-between"><label className="label mb-0">Pilih mufrodat</label><span className="text-[10px] font-bold text-muted">{selectedIds.length}/5 dipilih</span></div>
        <p className="mb-3 mt-1 text-xs leading-5 text-muted">Pilih kosakata yang ingin dilatih. Jika tidak memilih, sistem menggunakan kosakata contoh untuk tema tersebut.</p>
        <div className="max-h-[380px] space-y-2 overflow-y-auto pr-1">{topicWords.map((word) => { const active = selectedIds.includes(word.id); return <button type="button" key={word.id} onClick={() => toggleWord(word.id)} className={`flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition ${active ? "border-forest bg-mint" : "border-forest/10 bg-white hover:border-forest/25"}`}><span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${active ? "border-forest bg-forest text-white" : "border-forest/20 bg-white"}`}>{active && <Check size={13} />}</span><span className="min-w-0 flex-1"><span dir="rtl" lang="ar" className="arabic-text block text-right text-lg text-forest">{word.arabic}</span><span className="mt-0.5 block text-[11px] text-muted">{word.meaning_id}</span></span></button>; })}</div>
        {selectedIds.length >= 5 && <p className="mt-2 text-[11px] text-muted">Maksimal 5 kata dipilih.</p>}
        {error && <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-xs text-red-700">{error}</p>}
        <button type="button" onClick={createDialogue} disabled={loading} className="btn-primary mt-5 w-full disabled:cursor-wait disabled:opacity-60">{loading ? "Menyusun percakapan..." : "Buat percakapan"}{!loading && <ArrowRight size={16} />}</button>
        <p className="mt-3 text-center text-[10px] text-muted">Template terkontrol · Tidak memerlukan API AI</p>
      </section>

      <section className="soft-card min-h-[520px] overflow-hidden"><div className="flex items-center justify-between border-b border-forest/8 px-5 py-4 sm:px-6"><div><p className="text-[10px] font-bold uppercase tracking-[.18em] text-leaf">Hasil latihan</p><h2 className="mt-1 text-lg font-bold text-forest">{dialogue?.title ?? "Percakapanmu akan muncul di sini"}</h2></div><span className="pill">{dialogue?.level ?? "A1"}</span></div>
        {!dialogue ? <div className="flex min-h-[450px] flex-col items-center justify-center px-7 py-12 text-center"><span className="flex h-16 w-16 items-center justify-center rounded-[22px] bg-mint text-forest"><Sparkles size={27} /></span><h3 className="mt-5 text-lg font-bold text-forest">Siap mulai berbicara?</h3><p className="mt-2 max-w-sm text-sm leading-6 text-muted">Pilih tema dan beberapa mufrodat di sebelah kiri. Dialog akan disusun di area ini lengkap dengan arti dan tombol audio.</p><div className="mt-6 flex flex-wrap justify-center gap-2"><span className="pill">1. Pilih kata</span><span className="pill">2. Susun dialog</span><span className="pill">3. Praktikkan</span></div></div> : <><div className="space-y-4 bg-[#fafbf8] p-4 sm:p-6">{dialogue.turns.map((turn, index) => <div key={`${turn.speaker}-${index}`} className={`flex ${turn.speaker === "B" ? "justify-end" : "justify-start"}`}><div className={`w-full max-w-[92%] rounded-2xl p-4 sm:max-w-[85%] ${turn.speaker === "B" ? "rounded-tr-sm bg-mint" : "rounded-tl-sm border border-forest/8 bg-white"}`}><div className="mb-2 flex items-center justify-between gap-3"><span className="text-[10px] font-bold uppercase tracking-[.14em] text-leaf">{turn.role}</span><SpeechButton text={turn.arabic} /></div><ArabicText className="block text-right text-[25px] font-medium text-forest sm:text-[28px]">{turn.arabic}</ArabicText><p className="mt-2 text-xs leading-5 text-muted">{turn.translation}</p></div></div>)}</div><div className="border-t border-forest/8 p-5 sm:p-6"><p className="mb-3 text-[10px] font-bold uppercase tracking-[.15em] text-muted">Kosakata terpilih</p><div className="flex flex-wrap gap-2">{dialogue.vocabularyUsed.map((word) => <span key={word.id} className="rounded-full border border-forest/10 bg-white px-3 py-1.5 text-xs"><span dir="rtl" lang="ar" className="arabic-text font-semibold text-forest">{word.arabic}</span><span className="ml-2 text-muted">{word.meaning_id}</span></span>)}</div><div className="mt-5 flex flex-wrap gap-2"><button type="button" onClick={() => { window.speechSynthesis?.cancel(); dialogue.turns.forEach((turn, i) => window.setTimeout(() => { if ("speechSynthesis" in window) { const u = new SpeechSynthesisUtterance(turn.arabic); u.lang = "ar-SA"; u.rate = .8; window.speechSynthesis.speak(u); } }, i * 1800)); }} className="btn-primary"><CirclePlay size={16} /> Putar seluruh dialog</button><button type="button" onClick={savePractice} className="btn-secondary"><Check size={16} /> Selesai berlatih</button><button type="button" onClick={() => setDialogue(null)} className="btn-secondary"><RotateCcw size={15} /> Ulangi</button></div></div></>}
      </section>
    </div>
  </div>;
}
