// backend/queue/queue.js
import { Queue } from 'bullmq';

const connection = { connection: { url: process.env.REDIS_URL } };

let queue;
export function getLogQueue() {
  if (!queue) {
    queue = new Queue('log-processing-queue', connection);
  }
  return queue;
}
