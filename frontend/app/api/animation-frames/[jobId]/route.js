// frontend/app/api/animation-frames/[jobId]/route.js
import { NextResponse } from 'next/server';
import supabase from '../../../supabase/supabaseClient.js';

export async function GET(_req, { params }) {
  const { jobId } = params;
  const { data, error } = await supabase
    .from('log_animations')
    .select('*')
    .eq('job_id', jobId)
    .order('frame_number', { ascending: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
