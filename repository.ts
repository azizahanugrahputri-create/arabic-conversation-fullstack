import { TOPICS, VOCABULARY } from "@/lib/data";
import type { Topic, Vocabulary } from "@/lib/types";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function mapTopic(row: any): Topic {
  return {
    id: String(row.id), slug: row.slug, title: row.title, title_ar: row.title_ar,
    description: row.description ?? "", level: row.level ?? "A1", icon: row.icon ?? "book-open", sort_order: row.sort_order ?? 0,
  };
}

function mapVocabulary(row: any): Vocabulary {
  const joinedTopic = Array.isArray(row.topics) ? row.topics[0] : row.topics;
  return {
    id: String(row.id), topic_id: row.topic_id, topicSlug: joinedTopic?.slug ?? row.topicSlug ?? "taaruf",
    arabic: row.arabic, transliteration: row.transliteration ?? "", meaning_id: row.meaning_id,
    word_type: row.word_type ?? "isim", gender: row.gender ?? null, form_accusative: row.form_accusative ?? null,
    grammar_tags: row.grammar_tags ?? [], level: row.level ?? "A1", audio_url: row.audio_url ?? null,
  };
}

export async function listTopics(): Promise<Topic[]> {
  const supabase = await createSupabaseServerClient();
  if (supabase) {
    const { data, error } = await supabase.from("topics").select("*").order("sort_order");
    if (!error && data?.length) return data.map(mapTopic);
  }
  return TOPICS;
}

export async function listVocabulary(topicSlug?: string): Promise<Vocabulary[]> {
  const supabase = await createSupabaseServerClient();
  if (supabase) {
    const { data, error } = await supabase.from("vocabulary").select("*, topics(slug)").order("arabic").limit(500);
    if (!error && data?.length) {
      const rows = data.map(mapVocabulary);
      return topicSlug ? rows.filter((item) => item.topicSlug === topicSlug) : rows;
    }
  }
  return topicSlug ? VOCABULARY.filter((item) => item.topicSlug === topicSlug) : VOCABULARY;
}

export async function requireStaff() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return { supabase: null, user: null, role: null, error: "Supabase belum dikonfigurasi." };
  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData.user) return { supabase, user: null, role: null, error: "Silakan masuk terlebih dahulu." };
  const { data: profile, error: profileError } = await supabase.from("profiles").select("role").eq("id", authData.user.id).maybeSingle();
  if (profileError || !profile || !["admin", "teacher"].includes(profile.role)) {
    return { supabase, user: authData.user, role: profile?.role ?? "student", error: "Akses hanya untuk guru atau admin." };
  }
  return { supabase, user: authData.user, role: profile.role, error: null };
}
