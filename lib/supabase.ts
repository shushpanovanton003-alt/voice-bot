import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

export async function getOrCreateUser(telegramId: number, username?: string) {
  const { data: existing } = await supabase
    .from('users')
    .select('*')
    .eq('telegram_id', telegramId)
    .single()

  if (existing) return existing

  const { data } = await supabase
    .from('users')
    .insert({ telegram_id: telegramId, username })
    .select()
    .single()

  return data
}

export async function saveRecording(userId: string, data: {
  transcript: string
  summary: string
  insights: string[]
  tasks: string[]
}) {
  await supabase.from('recordings').insert({ user_id: userId, ...data })
}