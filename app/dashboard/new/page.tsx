'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { supabase } from '@/lib/supabase'
import { STYLE_PRESETS } from '@/lib/constants'
import type { Style } from '@/lib/types'

export default function NewProjectPage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [selectedStyle, setSelectedStyle] = useState<Style>('apple')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    setLoading(true)
    setError('')

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/login')
        return
      }

      const { data, error: dbError } = await supabase
        .from('projects')
        .insert({
          user_id: user.id,
          title: title.trim(),
          description: description.trim(),
          style: selectedStyle,
          status: 'draft',
          data: { scenes: [], timeline: [], effects: {} },
        })
        .select()
        .single()

      if (dbError) throw dbError

      router.push(`/dashboard/${data.id}`)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al crear proyecto'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-dark">
      <header className="border-b border-white/10 backdrop-blur-xl bg-dark/50 sticky top-0 z-40">
        <div className="max-w-full mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Nuevo Proyecto</h1>
          <Button
            variant="outline"
            onClick={() => router.push('/dashboard')}
          >
            Cancelar
          </Button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-12">
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleCreate}
          className="space-y-6"
        >
          {/* Project Info */}
          <div className="glassmorphism p-6 rounded-xl space-y-4">
            <h2 className="text-lg font-semibold">Información del Proyecto</h2>

            <div>
              <label className="block text-sm font-medium mb-2">Título *</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Mi Video Promo Increíble"
                disabled={loading}
                autoFocus
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Descripción</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe brevemente tu proyecto..."
                disabled={loading}
                className="w-full px-4 py-2.5 bg-dark-secondary border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon transition-all resize-none"
                rows={3}
              />
            </div>
          </div>

          {/* Style Selection */}
          <div className="glassmorphism p-6 rounded-xl space-y-4">
            <h2 className="text-lg font-semibold">Elige un Estilo</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {Object.entries(STYLE_PRESETS).map(([key, preset]) => (
                <motion.button
                  key={key}
                  type="button"
                  onClick={() => setSelectedStyle(key as Style)}
                  whileHover={{ scale: 1.02 }}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    selectedStyle === key
                      ? 'border-neon bg-neon/10'
                      : 'border-white/10 hover:border-white/20'
                  }`}
                >
                  <h3 className="font-semibold mb-1">{preset.name}</h3>
                  <p className="text-sm text-gray-400">{preset.description}</p>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Preview */}
          {selectedStyle && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glassmorphism p-6 rounded-xl"
            >
              <h3 className="font-semibold mb-3">Vista Previa del Estilo</h3>
              <div
                className="h-32 rounded-lg flex items-center justify-center"
                style={{
                  backgroundColor: STYLE_PRESETS[selectedStyle].colors.bg,
                  color: STYLE_PRESETS[selectedStyle].colors.text,
                }}
              >
                <div className="text-center">
                  <p className="text-sm opacity-75">
                    {STYLE_PRESETS[selectedStyle].name}
                  </p>
                  <p className="text-lg font-semibold">Ejemplo de Video</p>
                </div>
              </div>
            </motion.div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm"
            >
              {error}
            </motion.div>
          )}

          <Button
            variant="primary"
            type="submit"
            disabled={loading || !title.trim()}
            className="w-full"
          >
            {loading ? 'Creando...' : 'Crear Proyecto'}
          </Button>
        </motion.form>
      </main>
    </div>
  )
}
