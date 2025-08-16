// backend/worker/worker.js
import { Worker, QueueEvents } from 'bullmq';
import supabase from '../../supabase/supabaseClient.js';
import { parseFileFor3D } from './parser.js';
import { getWSS, broadcast } from '../websocket/hub.js';

getWSS(); // start websocket hub

const connection = { connection: { url: process.env.REDIS_URL } };

const queueEvents = new QueueEvents('log-processing-queue', connection);
queueEvents.on('failed', ({ jobId, failedReason }) => {
  broadcast({ type: 'job_progress', jobId, status: 'failed', reason: failedReason });
});
queueEvents.on('completed', ({ jobId }) => {
  broadcast({ type: 'job_progress', jobId, status: 'completed' });
});

const worker = new Worker(
  'log-processing-queue',
  async (job) => {
    const { filePath, jobId } = job.data;

    broadcast({ type: 'job_progress', jobId, status: 'processing', progress: 0 });

    const { stats, spatialRows, animationRows } = await parseFileFor3D(
      filePath,
      jobId,
      ({ progress }) => broadcast({ type: 'job_progress', jobId, status: 'processing', progress })
    );

    // insert log_stats
    const { error: sErr } = await supabase.from('log_stats').insert({
      job_id: jobId,
      file_name: stats.file_name,
      total_logs: stats.total_logs,
      error_count: stats.error_count,
      warning_count: stats.warning_count,
      info_count: stats.info_count,
      unique_ips: stats.unique_ips,
      keywords_found: stats.keywords_found,
      processing_time: `${Math.ceil(stats.processing_time_ms/1000)} seconds`
    });
    if (sErr) throw sErr;

    // batch insert spatial (chunk to avoid payload limits)
    await batchInsert('log_spatial_data', spatialRows, 5000);

    // insert animation frames
    await batchInsert('log_animations', animationRows, 5000);

    broadcast({ type: 'scene_update', jobId, added: spatialRows.length });
    return { ok: true };
  },
  { ...connection, concurrency: 4 }
);

worker.on('completed', (job) => {
  broadcast({ type: 'job_progress', jobId: job.data.jobId, status: 'completed' });
});
worker.on('failed', (job, err) => {
  broadcast({ type: 'job_progress', jobId: job?.data?.jobId, status: 'failed', reason: err?.message });
});

async function batchInsert(table, rows, size) {
  for (let i = 0; i < rows.length; i += size) {
    const chunk = rows.slice(i, i + size);
    const { error } = await supabase.from(table).insert(chunk);
    if (error) throw error;
  }
}

console.log('[worker] ready');
