"use client";

import type { CompletionPayload } from "@/lib/completion";
import { getDeviceId } from "@/lib/deviceId";
import type { HistoryEntry } from "@/lib/sessions";

const RETRY_DELAYS_MS = [2000, 5000, 10000];

function headers(): HeadersInit {
  return { "content-type": "application/json", "x-device-id": getDeviceId() };
}

function wait(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

/**
 * Salvestab lõpetatud tegevuse taustal. Võrgu- või serverivea korral proovib
 * paar korda uuesti; kui ikka ei õnnestu, jääb kirje vaikselt ajaloost välja.
 * Korduv saatmine on ohutu, sest server tunneb sama taimerikorra ära.
 */
export async function saveSession(payload: CompletionPayload): Promise<boolean> {
  for (let attempt = 0; attempt <= RETRY_DELAYS_MS.length; attempt++) {
    try {
      const response = await fetch("/api/sessions", {
        method: "POST",
        headers: headers(),
        body: JSON.stringify(payload),
        keepalive: true,
      });
      if (response.ok) return true;
      // Vigaseid andmeid pole mõtet uuesti saata.
      if (response.status < 500) return false;
    } catch {
      // Võrk puudub; proovime uuesti.
    }
    if (attempt < RETRY_DELAYS_MS.length) await wait(RETRY_DELAYS_MS[attempt]);
  }
  return false;
}

export async function fetchHistory(): Promise<HistoryEntry[]> {
  const response = await fetch("/api/sessions", { headers: headers(), cache: "no-store" });
  if (!response.ok) throw new Error("history-load-failed");
  const data = (await response.json()) as { sessions: HistoryEntry[] };
  return data.sessions;
}

export async function clearHistory(): Promise<void> {
  const response = await fetch("/api/sessions", { method: "DELETE", headers: headers() });
  if (!response.ok) throw new Error("history-clear-failed");
}
