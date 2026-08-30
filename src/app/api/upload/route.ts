import { NextResponse } from "next/server";
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { auth } from "@/lib/auth";

const MAX = 5 * 1024 * 1024;
const TYPES: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Log in first" }, { status: 401 });
  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "No file" }, { status: 400 });
  if (!TYPES[file.type]) return NextResponse.json({ error: "Use a JPG, PNG or WebP" }, { status: 400 });
  if (file.size > MAX) return NextResponse.json({ error: "Max 5 MB" }, { status: 400 });

  const cloud = process.env.CLOUDINARY_URL;
  if (cloud) {
    const m = cloud.match(/^cloudinary:\/\/(\d+):([^@]+)@(.+)$/);
    if (!m) return NextResponse.json({ error: "Bad CLOUDINARY_URL" }, { status: 500 });
    const [, key, secret, name] = m;
    const timestamp = Math.floor(Date.now() / 1000);
    const { createHash } = await import("node:crypto");
    const signature = createHash("sha1").update(`folder=campusly&timestamp=${timestamp}${secret}`).digest("hex");
    const body = new FormData();
    body.append("file", file); body.append("api_key", key); body.append("timestamp", String(timestamp)); body.append("signature", signature); body.append("folder", "campusly");
    const res = await fetch(`https://api.cloudinary.com/v1_1/${name}/image/upload`, { method: "POST", body });
    const json = await res.json();
    if (!json.secure_url) return NextResponse.json({ error: json.error?.message ?? "Upload failed" }, { status: 502 });
    return NextResponse.json({ url: json.secure_url });
  }

  const dir = path.join(process.cwd(), "public", "uploads");
  await mkdir(dir, { recursive: true });
  const filename = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}.${TYPES[file.type]}`;
  await writeFile(path.join(dir, filename), Buffer.from(await file.arrayBuffer()));
  return NextResponse.json({ url: `/uploads/${filename}` });
}
