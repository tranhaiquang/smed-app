import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = "https://nxyyfqpzkhtopahihzjl.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im54eXlmcXB6a2h0b3BhaGloempsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI3MDMyMjUsImV4cCI6MjA5ODI3OTIyNX0.PWRUzhk9jkyoPnkQEEoyFpCY4fpzRvMY7ACmHKLz7Q4";

export const isSupabaseConfigured =
  supabaseUrl.startsWith("https://") &&
  supabaseUrl.includes(".supabase.co") &&
  supabaseAnonKey.length > 20 &&
  !supabaseAnonKey.includes("YOUR_");

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
