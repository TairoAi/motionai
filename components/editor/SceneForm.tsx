'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import type { Style } from '@/lib/types'
import { STYLE_PRESETS } from '@/lib/constants'

interface SceneFormProps {
  style: Style
  onGenerateScene: (data: {
    headline: string
    subtitle: string
    description: string
  }) => Promise<void>
  isGenerating: boolean
  error?: string
}

export default function SceneForm({
  style,
  onGenerateScene,
  isGenerating,
  error,
}: SceneFormProps) {
  const [headline, setHeadline] = useState('')
  const [subtitle, setSubtitle] = useState('')
  const [description, setDescription] = useState('')

  const preset = STYLE_PRESETS[style]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!headline.trim()) return

    await onGenerateScene({
      headline: headline.trim(),
      subtitle: subtitle.trim(),
      description: description.trim(),
    })

    setHeadline('')
    setSubtitle('')
    setDescription('')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glassmorphism p-6 rounded-xl"
    >
      <h3 className="font-semibold mb-4">Generador de Escenas IA</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Titular</label>
          <Input
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
            placeholder="Ej: Mi Aplicación Increíble"
            disabled={isGenerating}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Subtítulo</label>
          <Input
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            placeholder="Ej: La mejor solución para tu negocio"
            disabled={isGenerating}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Descripción</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe cómo quieres que se vea tu video... Ej: Comienza con transición suave, muestra el producto con zoom, luego agrega texto que aparece letra por letra, termina con glow effect"
            disabled={isGenerating}
            className="w-full px-4 py-2.5 bg-dark-secondary border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon transition-all resize-none"
            rows={4}
          />
        </div>

        <div className="p-3 bg-white/5 rounded-lg border border-white/10">
          <p className="text-xs text-gray-400 mb-1 font-medium">Estilo Seleccionado</p>
          <p className="text-sm font-semibold text-neon">{preset.name}</p>
          <p className="text-xs text-gray-500 mt-1">{preset.description}</p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm text-center"
          >
            {error}
          </motion.div>
        )}

        <Button
          variant="primary"
          type="submit"
          className="w-full"
          disabled={isGenerating || !headline.trim()}
        >
          {isGenerating ? '✨ Generando...' : '✨ Generar Escenas con IA'}
        </Button>
      </form>
    </motion.div>
  )
}
