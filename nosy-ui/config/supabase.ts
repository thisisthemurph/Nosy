import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "UNAVAILABLE"; //process.env.REACT_APP_SUPABASE_URL || "UNAVAILABLE";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_API_KEY || "UNAVAILABLE";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
