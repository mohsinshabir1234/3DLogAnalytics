"use client";
import React from "react";
import Filters from "../ui/filters";
import TimeScrubber from "../ui/timescrubbers";
import StatsPanel from "../ui/statsPanel";
import { useLogs } from "./logprovider";

export default function SceneOverlay() {
  const { handleUploadFile, selectedLogId, logs } = useLogs();
  const selected = selectedLogId ? logs.find(l => l.id === selectedLogId) : null;

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      <div style={{ display: "flex", gap: 16, padding: 16, pointerEvents: "auto" }}>
        <Filters />
        <TimeScrubber />
        <div>
          <label
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 12px",
              background: "#fff",
              borderRadius: 8,
              border: "1px solid #ddd",
              cursor: "pointer"
            }}
          >
            Upload JSON Logs
            <input
              type="file"
              accept="application/json"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleUploadFile(f);
              }}
              style={{ display: "none" }}
            />
          </label>
        </div>
      </div>

      {/* Selected details (bottom-right) */}
      <div style={{ position: "absolute", right: 16, bottom: 16, pointerEvents: "auto" }}>
        <StatsPanel />
        {selected && (
          <div style={{ marginTop: 12, background: "#fff", padding: 12, borderRadius: 8, width: 300, boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>Selected Log</div>
            <pre style={{ margin: 0, fontSize: 12, whiteSpace: "pre-wrap" }}>
{JSON.stringify(selected, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
