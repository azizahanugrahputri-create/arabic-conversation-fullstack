import { NextResponse } from "next/server";
import { listTopics } from "@/lib/repository";

export async function GET() {
  const topics = await listTopics();
  return NextResponse.json({ topics });
}
