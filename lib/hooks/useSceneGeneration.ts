import { useState } from 'react'
import type { Scene, Style } from '@/lib/types'

interface UseSceneGenerationProps {
  projectId: string
  style: Style
}

interface GenerateSceneInput {
  headline: string
  subtitle: string
  description: string
}

export function useSceneGeneration({ projectId, style }: UseSceneGenerationProps) {
  const [scenes, setScenes] = useState<Scene[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const generateScene = async (input: GenerateSceneInput): Promise<Scene[] | null> => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/generate-scene', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          style,
          ...input,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Error al generar escenas')
      }

      const data = await response.json()
      const newScenes: Scene[] = data.scenes || []
      setScenes((prev) => [...prev, ...newScenes])
      return newScenes
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error desconocido'
      setError(message)
      return null
    } finally {
      setLoading(false)
    }
  }

  const removeScene = (sceneId: string) => {
    setScenes((prev) => prev.filter((s) => s.id !== sceneId))
  }

  const updateScene = (sceneId: string, updates: Partial<Scene>) => {
    setScenes((prev) =>
      prev.map((s) => (s.id === sceneId ? { ...s, ...updates } : s))
    )
  }

  const clearScenes = () => {
    setScenes([])
  }

  return {
    scenes,
    loading,
    error,
    generateScene,
    removeScene,
    updateScene,
    clearScenes,
  }
}
