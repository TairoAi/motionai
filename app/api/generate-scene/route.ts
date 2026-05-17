import { NextRequest, NextResponse } from 'next/server'
import { STYLE_PRESETS } from '@/lib/constants'

const OPENAI_API_KEY = process.env.OPENAI_API_KEY

interface SceneInput {
  projectId: string
  style: string
  headline: string
  subtitle: string
  description: string
}

interface GeneratedScene {
  id: string
  type: string
  duration: number
  text?: string
  effect?: string
  bgColor?: string
}

export async function POST(request: NextRequest) {
  try {
    if (!OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'API key de OpenAI no configurado' },
        { status: 500 }
      )
    }

    const body: SceneInput = await request.json()
    const { projectId, style, headline, subtitle, description } = body

    if (!projectId || !style || !headline) {
      return NextResponse.json(
        { error: 'Faltan parámetros requeridos' },
        { status: 400 }
      )
    }

    // Validate style
    if (!Object.keys(STYLE_PRESETS).includes(style)) {
      return NextResponse.json(
        { error: 'Estilo inválido' },
        { status: 400 }
      )
    }

    const stylePreset = STYLE_PRESETS[style as keyof typeof STYLE_PRESETS]

    const systemPrompt = `You are a professional video director and motion designer specializing in cinematic product videos. Your task is to generate a detailed scene structure for a video that looks like ${stylePreset.name} style videos.

You MUST respond ONLY with valid JSON, no other text. The JSON should be an array of scene objects.

Each scene object must have:
- id: unique identifier (e.g., "scene_1", "scene_2")
- type: one of "title", "transition", "media", "text", "effect" (string)
- duration: duration in milliseconds (number, between 500 and 5000)
- text: the text content if type is "title" or "text" (string, optional)
- effect: animation effect name if type is "effect" (string, optional)

Guidelines for ${stylePreset.name} style:
- ${stylePreset.description}
- Use smooth transitions (300-500ms)
- Include text animations that appear elegantly
- Match the aesthetic of ${stylePreset.name} videos

Generate 4-6 scenes total for this video.`

    const userPrompt = `Create scenes for a video with these details:
- Headline: "${headline}"
- Subtitle: "${subtitle || '(no subtitle)'}"
- Description: "${description || '(no specific description)'}"

Generate the scene JSON array. ONLY output valid JSON, nothing else.`

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.8,
        max_tokens: 1500,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('OpenAI API error:', errorData)
      return NextResponse.json(
        { error: 'Error al llamar a OpenAI API' },
        { status: response.status }
      )
    }

    const data = await response.json()
    const content = data.choices[0]?.message?.content

    if (!content) {
      return NextResponse.json(
        { error: 'No se recibió respuesta de OpenAI' },
        { status: 500 }
      )
    }

    // Parse JSON response
    let scenes: GeneratedScene[] = []
    try {
      // Extract JSON from the response (in case there's extra text)
      const jsonMatch = content.match(/\[[\s\S]*\]/)
      if (jsonMatch) {
        scenes = JSON.parse(jsonMatch[0])
      } else {
        scenes = JSON.parse(content)
      }
    } catch (parseError) {
      console.error('JSON parse error:', parseError, 'Content:', content)
      return NextResponse.json(
        { error: 'Error al parsear respuesta de OpenAI' },
        { status: 500 }
      )
    }

    // Validate and normalize scenes
    const validScenes = scenes
      .filter((s: any): s is GeneratedScene => s && typeof s === 'object')
      .map((s, idx) => ({
        id: s.id || `scene_${idx + 1}`,
        type: s.type || 'transition',
        duration: Math.max(500, Math.min(5000, s.duration || 1000)),
        text: s.text || undefined,
        effect: s.effect || undefined,
      }))

    if (validScenes.length === 0) {
      return NextResponse.json(
        { error: 'No se generaron escenas válidas' },
        { status: 500 }
      )
    }

    return NextResponse.json({ scenes: validScenes })
  } catch (error) {
    console.error('Generate scene error:', error)
    return NextResponse.json(
      { error: 'Error al generar escenas' },
      { status: 500 }
    )
  }
}
