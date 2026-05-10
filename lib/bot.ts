import { Bot } from 'grammy'
import { transcribeAudio } from './whisper'
import { processThought } from './claude'
import { getOrCreateUser, saveRecording } from './supabase'

export const bot = new Bot(process.env.BOT_TOKEN!)

bot.command('start', async (ctx) => {
  await getOrCreateUser(ctx.from!.id, ctx.from?.username)
  await ctx.reply(
    '👋 Привет! Я твой AI-дневник мыслей.\n\nОтправь голосовое сообщение — я транскрибирую, структурирую и сохраню твою идею.',
    { parse_mode: 'HTML' }
  )
})

bot.on('message:voice', async (ctx) => {
  const thinking = await ctx.reply('⏳ Обрабатываю...')

  try {
    const user = await getOrCreateUser(ctx.from!.id, ctx.from?.username)

    const file = await ctx.getFile()
    const url = `https://api.telegram.org/file/bot${process.env.BOT_TOKEN}/${file.file_path}`
    const res = await fetch(url)
    const buffer = Buffer.from(await res.arrayBuffer())

    const transcript = await transcribeAudio(buffer, 'voice.ogg')
    const result = await processThought(transcript)

    await saveRecording(user.id, { transcript, ...result })

    const reply = [
      `📝 <b>Резюме</b>\n${result.summary}`,
      result.insights.length ? `\n💡 <b>Инсайты</b>\n${result.insights.map((i: string) => `• ${i}`).join('\n')}` : '',
      result.tasks.length ? `\n✅ <b>Задачи</b>\n${result.tasks.map((t: string) => `• ${t}`).join('\n')}` : '',
    ].join('')

    await ctx.api.editMessageText(ctx.chat.id, thinking.message_id, reply, { parse_mode: 'HTML' })

  } catch (err) {
    console.error(err)
    await ctx.api.editMessageText(ctx.chat.id, thinking.message_id, '❌ Ошибка. Попробуй ещё раз.')
  }
})
