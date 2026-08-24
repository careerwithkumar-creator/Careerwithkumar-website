"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const POLL_MS = 5_000;

export function LiveReadingNow({ initialCount }: { initialCount: number }) {
  const [count, setCount] = useState(initialCount);

  useEffect(() => {
    const supabase = createClient();
    let cancelled = false;

    async function poll() {
      const cutoff = new Date(Date.now() - 60_000).toISOString();
      const { data, error } = await supabase
        .from("post_presence")
        .select("session_id")
        .gt("last_seen_at", cutoff);

      if (!cancelled && !error && data) {
        setCount(new Set(data.map((r) => r.session_id)).size);
      }
    }

    const interval = setInterval(poll, POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  return <>{count.toLocaleString("en-IN")}</>;
}
