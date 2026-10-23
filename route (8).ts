import { NextRequest, NextResponse } from "next/server";
import { requireStaff } from "@/lib/repository";

export async function DELETE(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const auth = await requireStaff();
  if (!auth.supabase) return NextResponse.json({ error: "Supabase belum dikonfigurasi." }, { status: 503 });
  if (!auth.user || auth.error) return NextResponse.json({ error: auth.error ?? "Tidak diizinkan." }, { status: 403 });
  const { id } = await context.params;
  const { error } = await auth.supabase.from("vocabulary").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
