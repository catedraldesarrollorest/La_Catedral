import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hadbwpdcpimylcjqeoph.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhhZGJ3cGRjcGlteWxjanFlb3BoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkyNzcyMTksImV4cCI6MjA5NDg1MzIxOX0.Zrcz1RYUiUzSkQNAOHzb93vX2FpCwmMNylFtEPMzpBs';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
