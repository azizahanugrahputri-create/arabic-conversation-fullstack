"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { BookOpen, ChartNoAxesColumn, GraduationCap, House, MessagesSquare, ShieldCheck, Sparkles } from "lucide-react";
import clsx from "clsx";

const links = [
  { href: "/", label: "Beranda", icon: House },
  { href: "/mufrodat", label: "Mufrodat", icon: BookOpen },
  { href: "/conversation", label: "Percakapan", icon: MessagesSquare },
  { href: "/practice", label: "Latihan", icon: GraduationCap },
  { href: "/progress", label: "Progres", icon: ChartNoAxesColumn },
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="min-h-screen bg-sand text-ink">
      <header className="sticky top-0 z-40 border-b border-forest/10 bg-sand/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3" aria-label="Arabiyyati beranda">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-forest text-gold shadow-sm"><BookOpen size={20} /></span>
            <span className="leading-tight"><span className="block text-lg font-bold tracking-tight text-forest">عَرَبِيَّتِي</span><span className="block text-[10px] font-semibold uppercase tracking-[0.19em] text-muted">Arabiyyati</span></span>
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            {links.map(({ href, label, icon: Icon }) => {
              const active = pathname === href || (href !== "/" && pathname.startsWith(href));
              return <Link key={href} href={href} className={clsx("nav-link", active && "nav-link-active")}><Icon size={16} />{label}</Link>;
            })}
          </nav>
          <div className="flex items-center gap-2">
            <Link href="/admin" className="hidden items-center gap-2 rounded-full border border-forest/15 px-3 py-2 text-xs font-semibold text-forest transition hover:bg-mint sm:inline-flex"><ShieldCheck size={15} /> Area Guru</Link>
            <Link href="/login" className="rounded-full bg-forest px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-leaf">Masuk</Link>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 pb-24 pt-7 sm:px-6 sm:pt-10 lg:px-8">{children}</main>
      <footer className="border-t border-forest/10 px-4 py-6 text-center text-xs text-muted">
        <span className="font-semibold text-forest">عَرَبِيَّتِي</span> · Belajar bahasa Arab melalui percakapan yang bermakna.
      </footer>
      <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-forest/10 bg-white/95 px-1 pb-[env(safe-area-inset-bottom)] pt-2 backdrop-blur md:hidden">
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== "/" && pathname.startsWith(href));
          return <Link key={href} href={href} className={clsx("flex flex-col items-center gap-1 rounded-xl px-1 py-1.5 text-[10px] font-semibold", active ? "text-forest" : "text-muted")}><Icon size={18} strokeWidth={active ? 2.5 : 1.8} /><span>{label}</span></Link>;
        })}
      </nav>
    </div>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return <div className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-leaf"><span className="h-px w-5 bg-gold" />{children}</div>;
}

export function PageHeading({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return <div className="mb-8 max-w-3xl"><Eyebrow>{eyebrow}</Eyebrow><h1 className="text-3xl font-bold tracking-tight text-forest sm:text-4xl">{title}</h1><p className="mt-3 max-w-2xl text-sm leading-7 text-muted sm:text-base">{description}</p></div>;
}

export function ArabicText({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <span dir="rtl" lang="ar" className={`arabic-text ${className}`}>{children}</span>;
}
