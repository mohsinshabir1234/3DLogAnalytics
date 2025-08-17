// frontend/app/api/visualization-config/route.js
import { NextResponse } from 'next/server';
import supabase from '../../supabase/supabaseClient.js';

// expects JSON: { user_id, config_name, camera_position, filter_settings, color_scheme, is_default }
export async function POST(req) {
  const body = await req.json();
  const { data, error } = await supabase.from('visualization_configs').insert({
    user_id: body.user_id,
    config_name: body.config_name,
    camera_position: body.camera_position ?? null,
    filter_settings: body.filter_settings ?? null,
    color_scheme: body.color_scheme ?? null,
    is_default: !!body.is_default
  }).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data);
}
