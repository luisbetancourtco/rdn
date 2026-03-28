import Anthropic from '@anthropic-ai/sdk'

let client: Anthropic | null = null

function getClient(): Anthropic {
  if (!client) client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  return client
}

const PROMPT = `Clasifica el siguiente artículo de marketing digital o IA.

Devuelve SOLO un objeto JSON con este formato exacto:
{
  "type": "novedad" | "evergreen",
  "relevance": "alta" | "media" | "baja",
  "reason": "explicación breve en español (máx 100 caracteres)"
}

Criterios:
- type "novedad": noticia reciente, anuncio, lanzamiento, actualización de producto/algoritmo
- type "evergreen": guía, tutorial, concepto, estrategia atemporal
- relevance "alta": impacto directo en marketing digital, SEO, ads, IA aplicada o growth
- relevance "media": relevante pero no urgente para un profesional de marketing
- relevance "baja": poco aplicable o muy genérico`

export interface Classification {
  type: 'novedad' | 'evergreen'
  relevance: 'alta' | 'media' | 'baja'
  reason: string
}

export async function classifyItem(
  title: string,
  summary: string,
): Promise<Classification | null> {
  try {
    const text = `Título: ${title}\n\nResumen: ${summary || '(sin resumen)'}`
    const response = await getClient().messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 256,
      messages: [{ role: 'user', content: `${PROMPT}\n\n${text}` }],
    })
    let content = (response.content[0] as { type: string; text: string }).text.trim()
    if (content.includes('```')) {
      const parts = content.split('```')
      content = parts.length > 1 ? parts[1].replace(/^json/, '').trim() : content
    }
    return JSON.parse(content) as Classification
  } catch (err) {
    console.error('[classifier] Error:', err)
    return null
  }
}
