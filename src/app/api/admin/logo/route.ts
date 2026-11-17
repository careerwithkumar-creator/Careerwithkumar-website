import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
export async function POST(request: NextRequest) {
  if (request.headers.get("origin") !== request.nextUrl.origin)
    return new NextResponse(null, { status: 403 });
  const db = await createClient();
  const {
    data: { user },
  } = await db.auth.getUser();
  if (
    !user ||
    !process.env.ADMIN_EMAIL ||
    user.email !== process.env.ADMIN_EMAIL
  )
    return new NextResponse(null, { status: 403 });
  if (Number(request.headers.get("content-length")) > 2100000)
    return NextResponse.json(
      { error: "Maximum upload is 2 MB" },
      { status: 413 },
    );
  const file = (await request.formData()).get("logo");
  if (
    !(file instanceof File) ||
    file.size > 2000000 ||
    !["image/png", "image/jpeg", "image/webp"].includes(file.type)
  )
    return NextResponse.json(
      { error: "Choose a PNG, JPEG or WebP under 2 MB" },
      { status: 400 },
    );
  const bytes = new Uint8Array(await file.arrayBuffer());
  const valid =
    file.type === "image/png"
      ? bytes[0] === 137 &&
        bytes[1] === 80 &&
        bytes[2] === 78 &&
        bytes[3] === 71
      : file.type === "image/jpeg"
        ? bytes[0] === 255 && bytes[1] === 216
        : String.fromCharCode(...bytes.slice(0, 4)) === "RIFF" &&
          String.fromCharCode(...bytes.slice(8, 12)) === "WEBP";
  if (!valid)
    return NextResponse.json({ error: "Invalid image file" }, { status: 400 });
  const name =
    crypto.randomUUID() +
    "." +
    { "image/png": "png", "image/jpeg": "jpg", "image/webp": "webp" }[
      file.type
    ];
  const { error } = await db.storage
    .from("company-logos")
    .upload(name, bytes, { contentType: file.type, upsert: false });
  if (error)
    return NextResponse.json(
      {
        error: "Upload unavailable. Verify storage migration and admin policy.",
      },
      { status: 400 },
    );
  return NextResponse.json({
    url: db.storage.from("company-logos").getPublicUrl(name).data.publicUrl,
  });
}
