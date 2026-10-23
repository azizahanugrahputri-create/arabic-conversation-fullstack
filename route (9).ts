import { NextRequest, NextResponse } from "next/server";
import { requireStaff, listTopics } from "@/lib/repository";

export async function POST(request: NextRequest) {
  const auth = await requireStaff();
  if (!auth.supabase) return NextResponse.json({ error: "Supabase belum dikonfigurasi." }, { status: 503 });
  if (!auth.user || auth.error) return NextResponse.json({ error: auth.error ?? "Tidak diizinkan." }, { status: 403 });
  try {
    const body = await request.json();
    const arabic = typeof body.arabic === "string" ? body.arabic.trim() : "";
    const transliteration = typeof body.transliteration === "string" ? body.transliteration.trim() : "";
    const meaning_id = typeof body.meaning_id === "string" ? body.meaning_id.trim() : "";
    const topicSlug = typeof body.topicSlug === "string" ? body.topicSlug : "";
    const word_type = typeof body.word_type === "string" ? body.word_type : "isim";
    const level = typeof body.level === "string" ? body.level : "A1";
    if (!arabic || !transliteration || !meaning_id || !topicSlug) return NextResponse.json({ error: "Tulisan Arab, transliterasi, arti, dan tema wajib diisi." }, { status: 400 });
    const topics = await listTopics();
    const topic = topics.find((item) => item.slug === topicSlug);
    if (!topic) return NextResponse.json({ error: "Tema tidak valid." }, { status: 400 });
    const { data: topicRow, error: topicError } = await auth.supabase.from("topics").select("id").eq("slug", topicSlug).single();
    if (topicError || !topicRow) return NextResponse.json({ error: "Tema tidak ditemukan di database. Jalankan supabase/schema.sql." }, { status: 400 });
    const { data, error } = await auth.supabase.from("vocabulary").insert({ topic_id: topicRow.id, arabic, transliteration, meaning_id, word_type, level, grammar_tags: [] }).select("*, topics(slug)").single();
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    const row: any = data;
    const mapped = { id: String(row.id), topic_id: row.topic_id, topicSlug: row.topics?.slug ?? topicSlug, arabic: row.arabic, transliteration: row.transliteration, meaning_id: row.meaning_id, word_type: row.word_type, gender: row.gender, form_accusative: row.form_accusative, grammar_tags: row.grammar_tags ?? [], level: row.level, audio_url: row.audio_url };
    return NextResponse.json({ vocabulary: mapped }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Permintaan tidak valid." }, { status: 400 });
  }
}
