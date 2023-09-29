import { createClient } from "@supabase/supabase-js";

export const supabaseUrl = "https://rtybtovqwycqgnatkeat.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ0eWJ0b3Zxd3ljcWduYXRrZWF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTU5MTA5NjksImV4cCI6MjAxMTQ4Njk2OX0.SH3nZOijmSM79KAaZ5VXomE3ONS534woZ6uFsNb-mPE";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
