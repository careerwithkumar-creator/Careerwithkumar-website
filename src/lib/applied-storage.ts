"use client";

const STORAGE_KEY = "cwk_applied_jobs";

function readSet(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return new Set(raw ? (JSON.parse(raw) as string[]) : []);
  } catch {
    return new Set();
  }
}

export function hasApplied(jobId: string): boolean {
  return readSet().has(jobId);
}

export function markApplied(jobId: string): void {
  const set = readSet();
  set.add(jobId);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]));
}
