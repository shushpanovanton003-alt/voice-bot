export async function processThought(transcript: string) {
  return {
    summary: transcript,
    insights: [],
    tasks: []
  }
}