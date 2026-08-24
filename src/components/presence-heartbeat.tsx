"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { getClientSessionId } from "@/lib/session-client";

const HEARTBEAT_MS = 15_000;

// Invisible — just keeps this session's post_presence row fresh while a
// public page is open, powering the "reading now" counts (hero stat, admin
// dashboard metric). No job_post_id: this tracks site-wide presence, not
// per-post viewers.
export function PresenceHeartbeat() {
  useEffect(() => {
    const supabase = createClient();
    const sessionId = getClientSessionId();
    if (!sessionId) return;

    function beat() {
      supabase
        .rpc("upsert_presence", { p_session_id: sessionId, p_job_post_id: null })
        .then(() => {});
    }

    beat();
    const interval = setInterval(beat, HEARTBEAT_MS);
    return () => clearInterval(interval);
  }, []);

  return null;
}
