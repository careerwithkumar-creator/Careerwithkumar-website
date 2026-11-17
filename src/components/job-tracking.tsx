"use client";
import { useEffect, useSyncExternalStore } from "react";
const subscribe = (callback: () => void) => {
  window.addEventListener("cwk-consent", callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener("cwk-consent", callback);
    window.removeEventListener("storage", callback);
  };
};
const snapshot = () => localStorage.getItem("cwk-analytics");
function setChoice() {
  window.dispatchEvent(new Event("cwk-consent"));
}
export function JobTracking({ slug }: { slug: string }) {
  const choice = useSyncExternalStore(subscribe, snapshot, () => null);
  useEffect(() => {
    const saved = localStorage.getItem("cwk-analytics");
    if (saved !== "yes") return;
    const params = new URLSearchParams(location.search);
    const source =
      params.get("utm_source") ||
      (/instagram/i.test(document.referrer)
        ? "instagram"
        : /whatsapp/i.test(document.referrer)
          ? "whatsapp"
          : /google/i.test(document.referrer)
            ? "google"
            : "direct");
    const send = (event: string) => {
      fetch("/api/job-traffic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          consent: true,
          event,
          slug,
          source,
          campaign: params.get("utm_campaign"),
          medium: params.get("utm_medium"),
        }),
        keepalive: true,
      }).catch(() => {});
    };
    send("view");
    const handler = (ev: MouseEvent) => {
      if ((ev.target as Element).closest("[data-official-apply]"))
        send("apply");
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [slug, choice]);
  return (
    <div className="mt-4 rounded-lg border border-border p-3 text-xs">
      <p>
        Optional campaign analytics counts pageviews and official-link clicks
        without storing visitor identities. Counts are not unique visitors.
      </p>
      {choice === null ? (
        <div className="mt-2 flex gap-4">
          <button
            onClick={() => {
              localStorage.setItem("cwk-analytics", "yes");
              setChoice();
            }}
          >
            Allow analytics
          </button>
          <button
            onClick={() => {
              localStorage.setItem("cwk-analytics", "no");
              setChoice();
            }}
          >
            Decline
          </button>
        </div>
      ) : (
        <button
          className="mt-2 underline"
          onClick={() => {
            localStorage.removeItem("cwk-analytics");
            setChoice();
          }}
        >
          Change analytics preference
        </button>
      )}
    </div>
  );
}
