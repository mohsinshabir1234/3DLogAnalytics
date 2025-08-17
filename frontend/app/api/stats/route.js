// frontend/app/api/stats/route.js
import { NextResponse } from 'next/server';
import supabase from '../../supabase/supabaseClient.js';

export async function GET() {
  const { data, error } = await supabase
    .from('log_stats')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
