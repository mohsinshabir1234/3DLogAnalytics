"use client";
import { useEffect } from "react";

// Minimal WebSocket client: expects JSON messages containing a log object.
// Example server message: {"type":"error","severity":2,"ts":7,"ipSrc":"5.5.5.5","ipDst":"1.1.1.1"}
export default function useLogsSocket(onLog) {
  useEffect(() => {
    let ws;
    try {
      ws = new WebSocket("ws://localhost:3002");
      ws.onmessage = (evt) => {
        try {
          const parsed = JSON.parse(evt.data);
          if (parsed && typeof parsed === "object") onLog?.(parsed);
        } catch { /* ignore */ }
      };
    } catch { /* ignore */ }

    return () => {
      try { ws && ws.close(); } catch {}
    };
  }, [onLog]);
}
