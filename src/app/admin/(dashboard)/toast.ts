"use client";

/** Fire a small toast shown by the toast host in AdminShell. */
export function adminToast(message: string) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("admin-toast", { detail: message }));
}
