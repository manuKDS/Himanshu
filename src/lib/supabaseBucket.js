import { createClient } from "@supabase/supabase-js";

const supabaseUrl = 'https://rdmvrvcywaolzigcpyhm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJkbXZydmN5d2FvbHppZ2NweWhtIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzQyMzMzNzIsImV4cCI6MTk4OTgwOTM3Mn0.a_ISkd92OMSEi0L_3hGjnxSccMwuujZOPq2vljRntKs';

const options = { auth: { persistSession: true } };

export const supabase = createClient(supabaseUrl, supabaseKey, options);
