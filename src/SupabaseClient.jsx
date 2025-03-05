import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://jcgxviclxxfsonnjxjih.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpjZ3h2aWNseHhmc29ubmp4amloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA5Mzg0NTUsImV4cCI6MjA1NjUxNDQ1NX0.ZCwwUcqcWP34Wm8qMSO47vVhoyk_6dFPKVB3gvSHBKE";

export const supabase = createClient(supabaseUrl, supabaseKey);