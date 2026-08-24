import { InstagramIcon } from "@/components/icons";
import { SITE_CONFIG } from "@/lib/site-config";

// A plain follow prompt — not a sync status indicator. Postings are added
// manually by the admin; this just points visitors to the Instagram page.
export function InstagramFollowStrip() {
  const { instagram, instagramHandle } = SITE_CONFIG.social;
  if (!instagram) return null;

  return (
    <div className="mb-5.5 flex items-center justify-between gap-3 rounded-lg border border-border bg-surface px-4 py-3 text-[12.5px] text-text-2">
      <span className="flex items-center gap-2">
        <InstagramIcon className="h-4 w-4 text-text-3" />
        Follow {instagramHandle ?? "us"} on Instagram for the latest updates
      </span>
      <a
        href={instagram}
        target="_blank"
        rel="noopener noreferrer"
        className="shrink-0 font-semibold text-blue hover:underline"
      >
        Follow on Instagram →
      </a>
    </div>
  );
}
