import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipos para o banco de dados
export type UserProfile = {
  id?: string
  user_id: string
  name: string
  age: number
  frequency: string
  symptoms: string[]
  moments: string[]
  professional: string
  goals: string[]
  created_at?: string
  updated_at?: string
}

export type DailyAnamnesis = {
  id?: string
  user_id: string
  date: string
  mood: string
  anxiety_level: number
  triggers: string[]
  symptoms: string[]
  notes: string
  time: string
  created_at?: string
}
