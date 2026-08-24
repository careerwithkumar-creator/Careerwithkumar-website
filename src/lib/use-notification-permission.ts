"use client";

import { useState, useSyncExternalStore } from "react";

function noopSubscribe() {
  return () => {};
}

function getSnapshot(): NotificationPermission {
  return typeof Notification === "undefined" ? "default" : Notification.permission;
}

function getServerSnapshot(): NotificationPermission {
  return "default";
}

// Shared by GetAlertsButton and SaveSearchButton — both are really the same
// "opt in to push notifications" action with different copy/icon.
export function useNotificationPermission() {
  // Bumped after requestPermission() resolves, to force re-reading the
  // snapshot (there's no permissionchange event to subscribe to).
  const [, forceRecheck] = useState(0);
  const permission = useSyncExternalStore(
    noopSubscribe,
    getSnapshot,
    getServerSnapshot,
  );

  async function requestPermission() {
    if (typeof Notification === "undefined") return;
    await Notification.requestPermission();
    forceRecheck((n) => n + 1);
    // Push subscription (service worker registration + saving the endpoint
    // to push_subscriptions) is wired up in a later build step.
  }

  return { permission, requestPermission };
}
