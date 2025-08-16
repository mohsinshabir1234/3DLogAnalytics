// backend/worker/parser.js
import fs from 'node:fs';
import readline from 'node:readline';
import crypto from 'node:crypto';

// Example log line:
// [2025-02-20T10:00:00Z] ERROR Database timeout {"userid":123,"ip":"192.168.1.1","coordinates":{"x":10,"y":5,"z":3}}
const LINE_RE = /^\[(.+?)\]\s+(\w+)\s+(.*?)(\s+\{.*\})?$/;

const LEVEL_MAP = { ERROR: 'error', INFO: 'info', WARNING: 'warning', WARN: 'warning' };

function ipHashToZ(ip) {
  if (!ip) return 0;
  const h = crypto.createHash('md5').update(ip).digest();
  // map to -50..+50
  return (h[0] / 255) * 100 - 50;
}

// x = time progression (seconds from file start)
// y = severity/level (error: 3, warning: 2, info: 1)
function levelToY(level) {
  if (level === 'error') return 3;
  if (level === 'warning') return 2;
  return 1;
}

export async function parseFileFor3D(filePath, jobId, onProgress = () => {}) {
  const stats = {
    job_id: jobId,
    file_name: filePath.split('/').pop(),
    total_logs: 0,
    error_count: 0,
    warning_count: 0,
    info_count: 0,
    unique_ips: 0,
    keywords_found: {},
    startedAt: Date.now()
  };

  const ips = new Set();
  const spatialRows = [];
  const frames = []; // [{ frame_number, timestamp, scene_data }]

  const rs = fs.createReadStream(filePath, { encoding: 'utf8' });
  const rl = readline.createInterface({ input: rs, crlfDelay: Infinity });

  let firstTs = null;
  let lineNo = 0;

  for await (const line of rl) {
    lineNo++;
    if (!line.trim()) continue;
    const m = line.match(LINE_RE);
    if (!m) continue;

    const [, tsRaw, levelRaw, messageRaw, jsonRaw] = m;
    const iso = new Date(tsRaw);
    if (!firstTs) firstTs = iso;

    const level = LEVEL_MAP[levelRaw.toUpperCase()] || 'info';
    const meta = jsonRaw ? safeJson(jsonRaw.trim()) : {};

    const ip = meta?.ip || null;
    if (ip) ips.add(ip);

    // keywords (very basic demo)
    for (const kw of ['timeout','fail','denied','latency','db','cpu']) {
      if (messageRaw.toLowerCase().includes(kw)) {
        stats.keywords_found[kw] = (stats.keywords_found[kw] || 0) + 1;
      }
    }

    const seconds = Math.max(0, Math.floor((iso - firstTs) / 1000));
    const x = seconds;
    const y = levelToY(level);
    const z = meta?.coordinates ? meta.coordinates.z ?? ipHashToZ(ip) : ipHashToZ(ip);

    const pos = {
      position_x: meta?.coordinates?.x ?? x,
      position_y: meta?.coordinates?.y ?? y,
      position_z: z
    };

    spatialRows.push({
      job_id: jobId,
      log_entry_id: `${jobId}:${lineNo}`,
      position_x: Number(pos.position_x),
      position_y: Number(pos.position_y),
      position_z: Number(pos.position_z),
      log_level: level,
      timestamp: iso.toISOString(),
      ip_address: ip,
      message: messageRaw,
      metadata: meta
    });

    // simple animation frame bucket per second
    frames[seconds] ||= { frame_number: seconds, timestamp: iso.toISOString(), items: 0 };
    frames[seconds].items++;

    // stats
    stats.total_logs++;
    if (level === 'error') stats.error_count++;
    else if (level === 'warning') stats.warning_count++;
    else stats.info_count++;

    if (lineNo % 1000 === 0) onProgress({ progress: lineNo });
  }

  stats.unique_ips = ips.size;
  stats.processing_time_ms = Date.now() - stats.startedAt;

  // convert frames to DB rows
  const animationRows = frames
    .filter(Boolean)
    .map(f => ({
      job_id: jobId,
      frame_number: f.frame_number,
      timestamp: f.timestamp,
      scene_data: { new_items: f.items } // you can expand this to full scene snapshots
    }));

  return { stats, spatialRows, animationRows };
}

function safeJson(s) {
  try { return JSON.parse(s); } catch { return null; }
}
