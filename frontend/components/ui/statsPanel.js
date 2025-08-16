"use client";
import React, { useMemo } from "react";
import { useLogs } from "../three/logprovider";

export default function StatsPanel() {
  const { filteredLogs } = useLogs();

  const counts = useMemo(() => {
    const c = { error: 0, info: 0, warning: 0 };
    for (const l of filteredLogs) c[l.type] = (c[l.type] || 0) + 1;
    return c;
  }, [filteredLogs]);

  return (
    <div style={{ background: "#fff", padding: 12, borderRadius: 8, border: "1px solid #ddd", width: 260 }}>
      <div style={{ fontWeight: 700, marginBottom: 8 }}>Stats</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
        <div style={{ background: "#ffe5e5", padding: 8, borderRadius: 6 }}>
          <div style={{ fontSize: 12 }}>Errors</div>
          <div style={{ fontWeight: 800, fontSize: 18 }}>{counts.error}</div>
        </div>
        <div style={{ background: "#e5efff", padding: 8, borderRadius: 6 }}>
          <div style={{ fontSize: 12 }}>Info</div>
          <div style={{ fontWeight: 800, fontSize: 18 }}>{counts.info}</div>
        </div>
        <div style={{ background: "#fff8e5", padding: 8, borderRadius: 6 }}>
          <div style={{ fontSize: 12 }}>Warnings</div>
          <div style={{ fontWeight: 800, fontSize: 18 }}>{counts.warning}</div>
        </div>
      </div>
    </div>
  );
}
