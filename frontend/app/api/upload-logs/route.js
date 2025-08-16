// frontend/app/api/upload-logs/route.js
import { NextResponse } from 'next/server';
import { getLogQueue } from '../../../../backend/queue/queue.js';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

export const runtime = 'nodejs'; // ensures Node runtime (for fs)

export async function POST(req) {
  const formData = await req.formData();
  const file = formData.get('file');
  if (!(file && typeof file === 'object')) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const dir = process.env.UPLOAD_DIR || '/tmp/uploads';
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const id = crypto.randomUUID();
  const filePath = path.join(dir, `${id}-${file.name}`);
  fs.writeFileSync(filePath, buffer);

  const jobId = id;
  const queue = getLogQueue();
  await queue.add(
    'process-log',
    { jobId, filePath },
    {
      attempts: 3,
      removeOnComplete: true,
      removeOnFail: true,
      priority: Math.max(1, 100000 - buffer.length) 
    }
  );

  return NextResponse.json({ jobId, filePath });
}
