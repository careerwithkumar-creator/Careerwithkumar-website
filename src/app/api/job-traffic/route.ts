import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
export async function POST(request: NextRequest) {
  if (request.headers.get("origin") !== request.nextUrl.origin)
    return new NextResponse(null, { status: 403 });
  if (
    request.headers.get("content-length") &&
    Number(request.headers.get("content-length")) > 1024
  )
    return new NextResponse(null, { status: 413 });
  let body;
  try {
    body = await request.json();
  } catch {
    return new NextResponse(null, { status: 400 });
  }
  if (
    !body ||
    body.consent !== true ||
    !["view", "apply"].includes(body.event) ||
    typeof body.slug !== "string" ||
    !/^[a-z0-9-]{1,200}$/.test(body.slug)
  )
    return new NextResponse(null, { status: 400 });
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY)
    return new NextResponse(null, { status: 503 });
  const source = ["instagram", "whatsapp", "google", "direct"].includes(
    body.source,
  )
    ? body.source
    : "other";
  const clean = (s: unknown, max: number) =>
    typeof s === "string" ? s.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, max) : "";
  const db = createAdminClient();
  const { error } = await db.rpc("record_job_traffic", {
    p_slug: body.slug,
    p_source: source,
    p_campaign: clean(body.campaign, 80),
    p_medium: clean(body.medium, 40),
    p_apply: body.event === "apply",
  });
  return new NextResponse(null, { status: error ? 503 : 204 });
}
