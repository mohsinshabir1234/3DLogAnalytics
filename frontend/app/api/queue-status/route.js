// frontend/app/api/queue-status/route.js
import { NextResponse } from 'next/server';
import { getLogQueue } from '../../../../backend/queue/queue.js';

export async function GET() {
  const queue = getLogQueue();
  const counts = await queue.getJobCounts();
  return NextResponse.json(counts);
}
