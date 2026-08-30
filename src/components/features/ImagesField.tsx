"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { Icon, Spinner } from "@/components/ui";

export function ImagesField({ name = "images", initial = [], max = 4, label = "Photos", hint = "JPG, PNG or WebP · up to 5 MB · first photo is the cover" }: { name?: string; initial?: string[]; max?: number; label?: string; hint?: string }) {
  const [images, setImages] = useState<string[]>(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [url, setUrl] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  async function upload(files: FileList | null) {
    if (!files?.length) return;
    setBusy(true); setError(null);
    try {
      for (const f of Array.from(files).slice(0, max - images.length)) {
        const body = new FormData(); body.append("file", f);
        const res = await fetch("/api/upload", { method: "POST", body });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error ?? "Upload failed");
        setImages((xs) => [...xs, json.url]);
      }
    } catch (e) { setError(e instanceof Error ? e.message : "Upload failed"); } finally { setBusy(false); if (fileRef.current) fileRef.current.value = ""; }
  }
  const addUrl = () => { if (/^https?:\/\/.+/i.test(url.trim()) && images.length < max) { setImages((xs) => [...xs, url.trim()]); setUrl(""); } };

  return (
    <div>
      <span className="mb-1.5 block text-[13px] font-semibold">{label}</span>
      {images.map((src) => <input key={src} type="hidden" name={name} value={src} />)}
      <div className="grid grid-cols-4 gap-3">
        {images.map((src, i) => (
          <div key={src} className="group relative aspect-square overflow-hidden rounded-md border border-border bg-bg">
            <Image src={src} alt="" fill unoptimized className="object-cover" />
            {i === 0 ? <span className="absolute left-1.5 top-1.5 rounded-pill bg-ink/80 px-2 py-0.5 text-[10px] font-semibold text-white">Cover</span> : null}
            <button type="button" onClick={() => setImages((xs) => xs.filter((x) => x !== src))} aria-label="Remove" className="absolute right-1.5 top-1.5 flex size-7 items-center justify-center rounded-pill bg-white/90 text-danger opacity-0 shadow transition-opacity group-hover:opacity-100"><Icon name="trash" size={14} /></button>
          </div>
        ))}
        {images.length < max ? (
          <button type="button" onClick={() => fileRef.current?.click()} disabled={busy} className="flex aspect-square flex-col items-center justify-center gap-1.5 rounded-md border-2 border-dashed border-border text-muted transition-colors hover:border-primary hover:text-primary">
            {busy ? <Spinner /> : <Icon name="plus" size={20} />}<span className="text-xs">{busy ? "Uploading…" : "Add photo"}</span>
          </button>
        ) : null}
      </div>
      <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" multiple className="hidden" onChange={(e) => upload(e.target.files)} />
      <div className="mt-2 flex gap-2">
        <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="…or paste an image URL" className="h-9 flex-1 rounded-[10px] border border-border bg-surface px-3 text-[13px] outline-none focus:border-primary" />
        <button type="button" onClick={addUrl} className="h-9 rounded-[10px] bg-primary-light px-3 text-[13px] font-semibold text-primary">Add</button>
      </div>
      <p className="mt-1.5 text-xs text-muted">{error ? <span className="text-danger">{error}</span> : hint}</p>
    </div>
  );
}
