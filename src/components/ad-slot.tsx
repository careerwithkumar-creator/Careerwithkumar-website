"use client";
import { useEffect, useRef } from "react";
import Script from "next/script";
import { ads } from "@/lib/ads";
export function AdSlot({ placement }: { placement: keyof typeof ads.slots }) {
  const started = useRef(false);
  const enabled =
    ads.enabled &&
    /^ca-pub-\d+$/.test(ads.publisher) &&
    /^\d+$/.test(ads.slots[placement]);
  function pushAd() {
    if (started.current) return;
    try {
      const w = window as unknown as { adsbygoogle: unknown[] };
      (w.adsbygoogle = w.adsbygoogle || []).push({});
      started.current = true;
    } catch {}
  }
  useEffect(() => {
    if (enabled) pushAd();
  }, [enabled]);
  if (!enabled) return null;
  return (
    <aside
      aria-label="Advertisement"
      className="my-6 min-h-[280px] overflow-hidden rounded-lg border border-border p-3"
    >
      <p className="text-center text-xs text-text-3">Advertisement</p>
      <Script
        id="adsense"
        src={
          "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=" +
          ads.publisher
        }
        crossOrigin="anonymous"
        strategy="afterInteractive"
        onReady={pushAd}
      />
      <ins
        className="adsbygoogle"
        style={{ display: "block", minHeight: 250 }}
        data-ad-client={ads.publisher}
        data-ad-slot={ads.slots[placement]}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </aside>
  );
}
