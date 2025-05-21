// lib/embeddings.ts
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function getEmbedding(input: string): Promise<number[]> {
  const res = await openai.embeddings.create({
    model: 'text-embedding-ada-002',
    input: [input],
  })
  return res.data[0].embedding
}
