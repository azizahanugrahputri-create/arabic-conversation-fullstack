import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { AppShell } from "@/components/app-shell";

export const metadata: Metadata = {
  title: "Arabiyyati — Belajar Percakapan Bahasa Arab",
  description: "Belajar mufrodat dan praktik percakapan bahasa Arab secara interaktif.",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return <html lang="id"><body><AppShell>{children}</AppShell></body></html>;
}
