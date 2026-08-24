"use client";

// Client-only bookmark list — no server table for this. It's a lightweight
// per-browser convenience, not a business metric worth tracking (unlike
// applied_reactions), so localStorage alone is the right amount of feature.
const STORAGE_KEY = "cwk_saved_jobs";
// A same-tab custom event — the native `storage` event only fires in OTHER
// tabs, not the one that made the change, so the header's count badge
// wouldn't update when a SaveButton is clicked on the same page.
const CHANGE_EVENT = "cwk-saved-jobs-changed";

function readSet(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return new Set(raw ? (JSON.parse(raw) as string[]) : []);
  } catch {
    return new Set();
  }
}

function writeSet(set: Set<string>): void {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]));
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function hasSaved(jobId: string): boolean {
  return readSet().has(jobId);
}

export function getSavedCount(): number {
  return readSet().size;
}

export function toggleSaved(jobId: string): boolean {
  const set = readSet();
  const nowSaved = !set.has(jobId);
  if (nowSaved) set.add(jobId);
  else set.delete(jobId);
  writeSet(set);
  return nowSaved;
}

export function subscribeSavedJobs(callback: () => void): () => void {
  window.addEventListener(CHANGE_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(CHANGE_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}
