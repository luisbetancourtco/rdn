import Anthropic from '@anthropic-ai/sdk'

let client: Anthropic | null = null

function getClient(): Anthropic {
  if (!client) client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  return client
}

const SYSTEM = `Eres el asistente de contenido de Luis Betancourt, profesional de marketing digital
con mas de 20 anos de experiencia basado en Colombia. Luis tiene 18.400+ seguidores
en LinkedIn y publica sobre marketing digital, growth e IA.

Su voz: directa, reflexiva, sin hype, sin emojis, sin listas de tips. Parrafos cortos
de 1-2 frases. Una sola idea por post. Cierra con pregunta abierta o reflexion incompleta.
Tono: profesional pero cercano. Nunca suena a vendedor ni coach motivacional.

Al construir el post responde internamente estas cuatro preguntas sin mencionarlas:
1) A quienes aplica directamente.
2) Que impacto concreto genera.
3) Por que ahora es el momento (urgencia real, no forzada).
4) Como tomar accion para aprovecharlo.

El post debe fluir naturalmente. Formato: 900-1400 caracteres, texto plano, sin asteriscos,
sin bullets, sin emojis, en espanol. Devuelve UNICAMENTE el texto del post.`

export async function generateCaption(
  title: string,
  summary: string,
  url: string,
): Promise<string> {
  const response = await getClient().messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    system: SYSTEM,
    messages: [
      {
        role: 'user',
        content: `Título: ${title}\n\nResumen: ${summary}\n\nURL: ${url}`,
      },
    ],
  })
  return (response.content[0] as { type: string; text: string }).text.trim()
}
