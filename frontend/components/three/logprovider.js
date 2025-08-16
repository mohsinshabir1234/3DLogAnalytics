"use client";
import React, { createContext, useContext, useMemo, useState, useEffect, useCallback } from "react";
import useLogsSocket from "./useLogsSocket";

// Log shape example:
// { id, type: 'error'|'info'|'warning', severity?: number, ts: number, ipSrc?: string, ipDst?: string }

const LogsCtx = createContext(null);

export function useLogs() {
  const ctx = useContext(LogsCtx);
  if (!ctx) throw new Error("useLogs must be used within <LogsProvider>");
  return ctx;
}

export default function LogsProvider({ children }) {
  const [logs, setLogs] = useState(() => [
    { id: 1, type: "error", severity: 3, ts: 1, ipSrc: "1.1.1.1", ipDst: "2.2.2.2" },
    { id: 2, type: "info", ts: 2, ipSrc: "3.3.3.3", ipDst: "4.4.4.4" },
    { id: 3, type: "warning", ts: 3, ipSrc: "1.1.1.1", ipDst: "3.3.3.3" }
  ]);

  // timeline controls (seconds or discrete buckets)
  const [currentTime, setCurrentTime] = useState(3);
  const [playing, setPlaying] = useState(false);

  // filters
  const [filterTypes, setFilterTypes] = useState({ error: true, info: true, warning: true });
  const [timeRange, setTimeRange] = useState([0, 100]); // min, max inclusive
  const [ipQuery, setIpQuery] = useState(""); // substring match, simple

  // selected object (for detail panel)
  const [selectedLogId, setSelectedLogId] = useState(null);

  // websocket: append logs in real time
  const handleIncomingLog = useCallback((log) => {
    setLogs(prev => {
      if (!log.id) log.id = prev.length ? prev[prev.length - 1].id + 1 : 1;
      return [...prev, log];
    });
  }, []);
  useLogsSocket(handleIncomingLog); // connects to ws://localhost:3002 by default

  // playback loop
  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => {
      setCurrentTime(t => Math.min(t + 1, timeRange[1]));
    }, 500);
    return () => clearInterval(id);
  }, [playing, timeRange]);

  // upload handler (client-side parse demo: expects JSON array)
  const handleUploadFile = async (file) => {
    const text = await file.text();
    try {
      const parsed = JSON.parse(text);
      if (Array.isArray(parsed)) {
        setLogs(prev => {
          // assign ids if missing
          let nextId = prev.length ? prev[prev.length - 1].id + 1 : 1;
          const normalized = parsed.map(l => ({ id: l.id ?? nextId++, ...l }));
          return [...prev, ...normalized];
        });
      } else {
        alert("Upload must be a JSON array of log objects.");
      }
    } catch (e) {
      alert("Failed to parse JSON: " + e.message);
    }
  };

  const filteredLogs = useMemo(() => {
    return logs.filter(l => {
      if (!filterTypes[l.type]) return false;
      if (l.ts < timeRange[0] || l.ts > timeRange[1]) return false;
      if (ipQuery) {
        const src = l.ipSrc || "";
        const dst = l.ipDst || "";
        const q = ipQuery.toLowerCase();
        if (!src.toLowerCase().includes(q) && !dst.toLowerCase().includes(q)) return false;
      }
      // time scrubber visibility: show logs up to currentTime
      if (l.ts > currentTime) return false;
      return true;
    });
  }, [logs, filterTypes, timeRange, ipQuery, currentTime]);

  const value = {
    logs,
    setLogs,
    filteredLogs,
    currentTime,
    setCurrentTime,
    playing,
    setPlaying,
    filterTypes,
    setFilterTypes,
    timeRange,
    setTimeRange,
    ipQuery,
    setIpQuery,
    selectedLogId,
    setSelectedLogId,
    handleUploadFile
  };

  return <LogsCtx.Provider value={value}>{children}</LogsCtx.Provider>;
}
