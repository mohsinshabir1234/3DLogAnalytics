// frontend/app/api/stats/[jobId]/route.js
import { NextResponse } from 'next/server';
import supabase from '../../../../../supabase/supabaseClient.js';

export async function GET(_req, { params }) {
  const { jobId } = params;
  const { data, error } = await supabase
    .from('log_stats')
    .select('*')
    .eq('job_id', jobId)
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 404 });
  return NextResponse.json(data);
}
