import { createClient } from '@supabase/supabase-js'

// Supabase client configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Create Supabase client for client-side usage
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
})

// Create Supabase client for server-side usage with service role
export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

// Database table names
export const TABLES = {
  PATIENTS: 'patients',
  LEDGER_LOGS: 'ledger_logs',
  USERS: 'users'
}

// Real-time subscription channels
export const CHANNELS = {
  PATIENT_QUEUE: 'patient_queue',
  DOCTOR_UPDATES: 'doctor_updates'
} 