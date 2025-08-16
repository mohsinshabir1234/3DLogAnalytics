// backend/ws/hub.js
import { WebSocketServer } from 'ws';

let wss;
export function getWSS() {
  if (wss) return wss;
  wss = new WebSocketServer({
    host: process.env.LIVE_WS_HOST || '0.0.0.0',
    port: Number(process.env.LIVE_WS_PORT || 3002)
  });
  wss.on('connection', (ws) => {
    ws.send(JSON.stringify({ type: 'hello', message: 'connected' }));
  });
  console.log(`[ws] listening on ws://${process.env.LIVE_WS_HOST || '0.0.0.0'}:${process.env.LIVE_WS_PORT || 3002}`);
  return wss;
}

// broadcast helper
export function broadcast(event) {
  if (!wss) return;
  const msg = JSON.stringify(event);
  wss.clients.forEach((c) => {
    try { c.send(msg); } catch {}
  });
}
