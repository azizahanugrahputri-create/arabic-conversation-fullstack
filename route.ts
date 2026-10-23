import { NextRequest, NextResponse } from "next/server";
import { listVocabulary } from "@/lib/repository";

export async function GET(request: NextRequest) {
  const topic = request.nextUrl.searchParams.get("topic") ?? undefined;
  const vocabulary = await listVocabulary(topic);
  return NextResponse.json({ vocabulary });
}
