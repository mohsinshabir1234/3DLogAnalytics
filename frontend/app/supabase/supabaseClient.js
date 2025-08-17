import {createClient} from '@supabase/supabase-js';
const supabaseUrl = "https://brkhwxhiupmrnqdpjgqq.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJya2h3eGhpdXBtcm5xZHBqZ3FxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUxNzY2MTksImV4cCI6MjA3MDc1MjYxOX0.6JDuk4z8W0M-BSdWZm6ROHq-61V0zaAZA6d8NVRagSA";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;