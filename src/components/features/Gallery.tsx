"use client";

import Image from "next/image";
import { useState } from "react";
import { Thumb } from "./Cards";

export function Gallery({ images, alt, seed }: { images: string[]; alt: string; seed: string }) {
  const [i, setI] = useState(0);
  if (!images.length) return <Thumb alt={alt} seed={seed} className="h-[420px] rounded-[20px]" />;
  return (
    <div className="flex flex-col gap-3">
      <div className="relative h-[420px] overflow-hidden rounded-[20px] bg-bg"><Image key={images[i]} src={images[i]} alt={alt} fill unoptimized priority className="animate-fade-in object-cover" sizes="(min-width:1024px) 50vw, 100vw" /></div>
      {images.length > 1 ? (
        <div className="grid grid-cols-4 gap-3">
          {images.map((src, k) => <button key={src} type="button" onClick={() => setI(k)} aria-label={`Photo ${k + 1}`} className={`relative h-24 overflow-hidden rounded-md transition-all ${k === i ? "ring-2 ring-primary ring-offset-2" : "opacity-80 hover:opacity-100"}`}><Image src={src} alt="" fill unoptimized className="object-cover" sizes="200px" /></button>)}
        </div>
      ) : null}
    </div>
  );
}
