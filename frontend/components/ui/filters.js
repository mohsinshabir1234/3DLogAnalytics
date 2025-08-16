"use client";
import React from "react";
import { useLogs } from "../three/logprovider";

export default function Filters() {
  const { filterTypes, setFilterTypes, ipQuery, setIpQuery, timeRange, setTimeRange } = useLogs();

  return (
    <div style={{ background: "#fff", padding: 12, borderRadius: 8, border: "1px solid #ddd", minWidth: 260 }}>
      <div style={{ fontWeight: 700, marginBottom: 8 }}>Filters</div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 12 }}>
        {["error", "info", "warning"].map(t => (
          <label key={t} style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input
              type="checkbox"
              checked={!!filterTypes[t]}
              onChange={(e) => setFilterTypes(prev => ({ ...prev, [t]: e.target.checked }))}
            />
            <span style={{ textTransform: "capitalize" }}>{t}</span>
          </label>
        ))}
      </div>

      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 12, marginBottom: 4 }}>Time range: {timeRange[0]} – {timeRange[1]}</div>
        <input
          type="range"
          min={0}
          max={200}
          step={1}
          value={timeRange[0]}
          onChange={(e) => setTimeRange([Number(e.target.value), timeRange[1]])}
          style={{ width: "100%", marginBottom: 6 }}
        />
        <input
          type="range"
          min={0}
          max={200}
          step={1}
          value={timeRange[1]}
          onChange={(e) => setTimeRange([timeRange[0], Number(e.target.value)])}
          style={{ width: "100%" }}
        />
      </div>

      <div>
        <div style={{ fontSize: 12, marginBottom: 4 }}>IP contains</div>
        <input
          type="text"
          value={ipQuery}
          onChange={(e) => setIpQuery(e.target.value)}
          placeholder="e.g. 1.1.1"
          style={{ width: "100%", padding: 8, border: "1px solid #ddd", borderRadius: 6 }}
        />
      </div>
    </div>
  );
}
