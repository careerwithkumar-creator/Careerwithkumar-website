"use client";

const COOKIE_NAME = "cwk_sid";
const STORAGE_KEY = "cwk_sid";

function readCookie(name: string): string | null {
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${name}=([^;]*)`),
  );
  return match ? decodeURIComponent(match[1]) : null;
}

// localStorage is the primary store (survives cookie clearing separately),
// the `cwk_sid` cookie set by middleware is the fallback/sync source so a
// first-time visitor's client and server ids agree without an extra round trip.
export function getClientSessionId(): string {
  if (typeof window === "undefined") return "";

  const fromStorage = window.localStorage.getItem(STORAGE_KEY);
  if (fromStorage) return fromStorage;

  const sid = readCookie(COOKIE_NAME) ?? crypto.randomUUID();
  window.localStorage.setItem(STORAGE_KEY, sid);
  return sid;
}
