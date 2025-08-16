"use client";
import React from "react";
import { useLogs } from "../three/logprovider";

export default function TimeScrubber() {
  const { currentTime, setCurrentTime, playing, setPlaying, timeRange } = useLogs();

  return (
    <div style={{ background: "#fff", padding: 12, borderRadius: 8, border: "1px solid #ddd", minWidth: 260 }}>
      <div style={{ fontWeight: 700, marginBottom: 8 }}>Time Scrubber</div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <button
          onClick={() => setPlaying(p => !p)}
          style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid #ddd", background: playing ? "#eafbea" : "#fff", cursor: "pointer" }}
        >
          {playing ? "Pause" : "Play"}
        </button>
        <div style={{ fontSize: 12 }}>t = {currentTime}</div>
      </div>
      <input
        type="range"
        min={timeRange[0]}
        max={timeRange[1]}
        step={1}
        value={currentTime}
        onChange={(e) => setCurrentTime(Number(e.target.value))}
        style={{ width: "100%" }}
      />
    </div>
  );
}
