"use client";

import { useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

export function SpeechButton({ text, className = "" }: { text: string; className?: string }) {
  const [speaking, setSpeaking] = useState(false);
  function play() {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      window.alert("Browser ini belum mendukung audio otomatis. Anda dapat menambahkan file audio rekaman melalui dashboard materi.");
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "ar-SA";
    utterance.rate = 0.82;
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(utterance);
  }
  return <button type="button" onClick={play} className={`icon-button ${className}`} aria-label="Dengarkan pelafalan" title="Dengarkan pelafalan">{speaking ? <VolumeX size={17} /> : <Volume2 size={17} />}</button>;
}
