import { NextRequest, NextResponse } from "next/server";
import { listTopics, listVocabulary } from "@/lib/repository";
import { generateDialogue } from "@/lib/dialogue-generator";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const topicSlug = typeof body.topicSlug === "string" ? body.topicSlug : "taaruf";
    const vocabularyIds: string[] = Array.isArray(body.vocabularyIds) ? body.vocabularyIds.filter((id: unknown) => typeof id === "string").slice(0, 5) : [];
    const [topics, allVocabulary] = await Promise.all([listTopics(), listVocabulary()]);
    const topic = topics.find((item) => item.slug === topicSlug);
    if (!topic) return NextResponse.json({ error: "Tema tidak ditemukan." }, { status: 400 });
    const topicVocabulary = allVocabulary.filter((item) => item.topicSlug === topicSlug);
    const selected = topicVocabulary.filter((item) => vocabularyIds.includes(item.id));
    const dialogue = generateDialogue(topicSlug, selected, topics);
    return NextResponse.json({ dialogue });
  } catch {
    return NextResponse.json({ error: "Permintaan tidak valid. Silakan coba lagi." }, { status: 400 });
  }
}
