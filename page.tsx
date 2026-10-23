import Link from "next/link";
import type { ComponentType } from "react";
import { ArrowRight, AudioLines, BookOpen, CheckCircle2, CirclePlay, MessageCircle, Sparkles, Target, Trophy, UsersRound } from "lucide-react";
import { TOPICS, VOCABULARY } from "@/lib/data";
import { ArabicText, Eyebrow } from "@/components/app-shell";

const topicIcons: Record<string, ComponentType<{ size?: number; className?: string }>> = {
  taaruf: UsersRound, school: BookOpen, family: UsersRound, food: AudioLines, market: Target,
};

export default function HomePage() {
  return <div className="space-y-10 sm:space-y-14">
    <section className="relative overflow-hidden rounded-[30px] bg-forest px-6 py-9 text-white shadow-soft sm:px-10 sm:py-12 lg:px-14 lg:py-16">
      <div className="absolute -right-12 -top-16 h-72 w-72 rounded-full border border-white/10" /><div className="absolute -right-1 top-0 h-56 w-56 rounded-full border border-white/10" /><div className="absolute bottom-[-95px] right-[22%] h-52 w-52 rounded-full bg-gold/10 blur-3xl" />
      <div className="relative grid items-center gap-10 lg:grid-cols-[1.2fr_.8fr]">
        <div className="max-w-2xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-[11px] font-semibold tracking-wide text-emerald-50"><Sparkles size={14} className="text-gold" /> BELAJAR DENGAN PRAKTIK, BUKAN HAFALAN SAJA</div>
          <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-[58px]">Dari mufrodat,<br /><span className="text-gold">menjadi percakapan.</span></h1>
          <p className="mt-5 max-w-xl text-sm leading-7 text-emerald-50/80 sm:text-base">Pilih kosakata yang ingin kamu kuasai, susun menjadi dialog, lalu dengarkan dan praktikkan percakapannya dalam bahasa Arab.</p>
          <div className="mt-8 flex flex-wrap gap-3"><Link href="/conversation" className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-3 text-sm font-bold text-forest transition hover:bg-[#e6c985]">Buat percakapan <ArrowRight size={17} /></Link><Link href="/mufrodat" className="inline-flex items-center gap-2 rounded-full border border-white/25 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"><BookOpen size={16} /> Jelajahi mufrodat</Link></div>
          <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-xs text-emerald-50/75"><span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-gold" /> Materi bertahap</span><span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-gold" /> Dialog kontekstual</span><span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-gold" /> Latihan mandiri</span></div>
        </div>
        <div className="relative mx-auto w-full max-w-sm">
          <div className="absolute inset-8 rounded-full bg-gold/10 blur-2xl" />
          <div className="relative rounded-[28px] border border-white/15 bg-white/[0.07] p-4 shadow-2xl backdrop-blur">
            <div className="flex items-center justify-between border-b border-white/10 px-2 pb-3"><div><p className="text-[10px] uppercase tracking-[.18em] text-emerald-50/60">Latihan hari ini</p><p className="mt-1 text-sm font-semibold">Di kantin sekolah</p></div><span className="rounded-full bg-gold/15 px-3 py-1 text-[10px] font-bold text-gold">A1 · Dasar</span></div>
            <div className="space-y-3 py-4">
              <div className="mr-8 rounded-2xl rounded-tr-sm bg-white/10 p-3.5"><p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-gold">البَائِعُ · Penjual</p><p dir="rtl" lang="ar" className="arabic-text text-right text-2xl">مَاذَا تُرِيدُ؟</p><p className="mt-1 text-xs text-emerald-50/70">Apa yang kamu inginkan?</p></div>
              <div className="ml-8 rounded-2xl rounded-tl-sm bg-[#e7f0e9] p-3.5 text-forest"><p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-leaf">الطَّالِبُ · Siswa</p><p dir="rtl" lang="ar" className="arabic-text text-right text-2xl">أُرِيدُ مَاءً</p><p className="mt-1 text-xs text-forest/70">Saya ingin air.</p></div>
            </div>
            <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/10 px-3 py-2.5"><span className="flex items-center gap-2 text-xs text-emerald-50/80"><CirclePlay size={16} className="text-gold" /> Dengarkan dialog</span><span className="text-[10px] text-emerald-50/50">01:20</span></div>
          </div>
          <div className="absolute -bottom-5 -left-5 flex items-center gap-3 rounded-2xl bg-white px-4 py-3 text-forest shadow-xl"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-mint"><Trophy size={18} /></span><span><span className="block text-xs font-bold">Sedikit demi sedikit</span><span className="block text-[10px] text-muted">Latihan setiap hari</span></span></div>
        </div>
      </div>
    </section>

    <section>
      <div className="mb-5 flex items-end justify-between gap-4"><div><Eyebrow>Mulai dari sini</Eyebrow><h2 className="text-2xl font-bold tracking-tight text-forest sm:text-3xl">Pilih tema percakapan</h2><p className="mt-2 text-sm text-muted">Belajar dari situasi yang dekat dengan kehidupan sehari-hari.</p></div><Link href="/mufrodat" className="hidden items-center gap-1 text-xs font-bold text-leaf sm:inline-flex">Semua mufrodat <ArrowRight size={14} /></Link></div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TOPICS.map((topic, index) => { const Icon = topicIcons[topic.slug] ?? BookOpen; const count = VOCABULARY.filter((word) => word.topicSlug === topic.slug).length; return <Link href={`/conversation?topic=${topic.slug}`} key={topic.slug} className="group soft-card p-5 transition hover:-translate-y-1 hover:border-forest/20 hover:shadow-soft"><div className="flex items-start justify-between"><span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-mint text-forest transition group-hover:bg-forest group-hover:text-white"><Icon size={21} /></span><span className="rounded-full bg-sand px-3 py-1 text-[10px] font-bold text-muted">{topic.level}</span></div><div className="mt-5 flex items-start justify-between gap-3"><div><h3 className="text-base font-bold text-forest">{topic.title}</h3><p className="arabic-text mt-1 text-lg text-leaf">{topic.title_ar}</p></div><span className="pt-1 text-xs text-muted">{String(index + 1).padStart(2, "0")}</span></div><p className="mt-3 min-h-10 text-xs leading-6 text-muted">{topic.description}</p><div className="mt-5 flex items-center justify-between border-t border-forest/8 pt-4"><span className="text-[11px] text-muted">{count} kosakata contoh</span><span className="flex items-center gap-1 text-xs font-bold text-leaf">Mulai <ArrowRight size={14} className="transition group-hover:translate-x-1" /></span></div></Link>; })}
      </div>
    </section>

    <section className="grid gap-5 lg:grid-cols-[.9fr_1.1fr]">
      <div className="soft-card p-6 sm:p-8"><Eyebrow>Metode belajar</Eyebrow><h2 className="text-2xl font-bold text-forest">Empat langkah menuju percakapan.</h2><div className="mt-6 space-y-5">{[{n:"01",t:"Pilih mufrodat",d:"Tentukan kata dan ungkapan yang ingin digunakan."},{n:"02",t:"Susun dialog",d:"Lihat bagaimana kosakata digunakan dalam konteks."},{n:"03",t:"Dengarkan",d:"Gunakan audio untuk membantu mengenali pelafalan."},{n:"04",t:"Praktikkan",d:"Baca peran A dan B, lalu coba tanpa melihat teks."}].map((step) => <div key={step.n} className="flex gap-4"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-mint text-xs font-extrabold text-forest">{step.n}</span><div><h3 className="text-sm font-bold text-forest">{step.t}</h3><p className="mt-1 text-xs leading-5 text-muted">{step.d}</p></div></div>)}</div></div>
      <div className="relative overflow-hidden rounded-[24px] bg-[#e6ece3] p-6 sm:p-8"><div className="absolute -right-8 -top-10 h-48 w-48 rounded-full border border-forest/10" /><div className="relative"><Eyebrow>Target belajar</Eyebrow><h2 className="max-w-md text-2xl font-bold leading-snug text-forest sm:text-3xl">Bukan sekadar tahu arti kata. Gunakan dalam kalimat.</h2><p className="mt-3 max-w-md text-sm leading-7 text-forest/70">Latihan dibuat untuk membangun kebiasaan memahami, mendengar, dan merespons percakapan bahasa Arab sedikit demi sedikit.</p><div className="mt-8 grid grid-cols-2 gap-3"><div className="rounded-2xl bg-white/80 p-4"><MessageCircle size={19} className="text-leaf" /><p className="mt-3 text-xl font-bold text-forest">25+</p><p className="mt-1 text-[11px] text-muted">Kata contoh untuk memulai</p></div><div className="rounded-2xl bg-white/80 p-4"><Target size={19} className="text-leaf" /><p className="mt-3 text-xl font-bold text-forest">A1</p><p className="mt-1 text-[11px] text-muted">Fokus tingkat pemula</p></div></div><Link href="/practice" className="btn-primary mt-6">Coba latihan singkat <ArrowRight size={15} /></Link></div></div>
    </section>
  </div>;
}
