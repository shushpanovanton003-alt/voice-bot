import OpenAI from 'openai'
import fs from 'fs'
import os from 'os'
import path from 'path'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function transcribeAudio(audioBuffer: Buffer, filename: string): Promise<string> {
  const tmpPath = path.join(os.tmpdir(), filename)

  fs.writeFileSync(tmpPath, audioBuffer)

  const result = await openai.audio.transcriptions.create({
    file: fs.createReadStream(tmpPath),
    model: 'whisper-1',
    language: 'ru',
  })

  return result.text
}