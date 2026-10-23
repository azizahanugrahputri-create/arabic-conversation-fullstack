import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return NextResponse.json({ progress: [], persisted: false });
  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) return NextResponse.json({ progress: [], persisted: false });
  const { data, error } = await supabase.from("learning_progress").select("id,activity_type,score,total,details,created_at").eq("user_id", authData.user.id).order("created_at", { ascending: false }).limit(100);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ progress: data ?? [], persisted: true });
}

export async function POST(request: NextRequest) {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return NextResponse.json({ saved: false, persisted: false });
  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) return NextResponse.json({ saved: false, persisted: false, message: "Masuk untuk menyimpan progres ke database." });
  try {
    const body = await request.json();
    const activity_type = typeof body.activity_type === "string" ? body.activity_type.slice(0, 40) : "practice";
    const score = Number.isFinite(body.score) ? Number(body.score) : 0;
    const total = Number.isFinite(body.total) ? Number(body.total) : 0;
    const details = body.details && typeof body.details === "object" ? body.details : {};
    const { error } = await supabase.from("learning_progress").insert({ user_id: authData.user.id, activity_type, score, total, details });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ saved: true, persisted: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Permintaan tidak valid." }, { status: 400 });
  }
}
