'use client'

import { motion, AnimatePresence } from 'framer-motion'
import type { Scene } from '@/lib/types'
import Button from '@/components/ui/Button'
import ScenePreviewCard from './ScenePreviewCard'

interface TimelineEditorProps {
  scenes: Scene[]
  selectedSceneId?: string
  onSelectScene: (sceneId: string) => void
  onRemoveScene: (sceneId: string) => void
  onUpdateScene: (sceneId: string, updates: Partial<Scene>) => void
}

export default function TimelineEditor({
  scenes,
  selectedSceneId,
  onSelectScene,
  onRemoveScene,
  onUpdateScene,
}: TimelineEditorProps) {
  if (scenes.length === 0) {
    return (
      <div className="glassmorphism p-6 rounded-xl text-center">
        <div className="text-4xl mb-3">🎬</div>
        <p className="text-gray-400 text-sm">
          Genera escenas con IA para comenzar a editar tu timeline
        </p>
      </div>
    )
  }

  const totalDuration = scenes.reduce((sum, s) => sum + s.duration, 0)
  const durationInSeconds = Math.round(totalDuration / 1000)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      {/* Timeline Header */}
      <div className="glassmorphism p-4 rounded-xl">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold">Timeline</h3>
          <span className="text-xs text-gray-400 bg-white/5 px-3 py-1 rounded-full">
            {scenes.length} escenas • {durationInSeconds}s
          </span>
        </div>

        {/* Progress Bar */}
        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-neon via-cyan-400 to-neon"
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: durationInSeconds * 0.1, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Scenes Grid */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        <AnimatePresence>
          {scenes.map((scene, idx) => (
            <ScenePreviewCard
              key={scene.id}
              scene={scene}
              index={idx}
              isSelected={selectedSceneId === scene.id}
              onSelect={() => onSelectScene(scene.id)}
              onDelete={() => onRemoveScene(scene.id)}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Selected Scene Details */}
      {selectedSceneId && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glassmorphism p-4 rounded-xl"
        >
          <h4 className="text-sm font-semibold mb-3">Editar Escena</h4>

          {scenes
            .filter((s) => s.id === selectedSceneId)
            .map((scene) => (
              <div key={scene.id} className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-gray-400 block mb-1">
                    Duración (ms)
                  </label>
                  <input
                    type="number"
                    min="500"
                    max="5000"
                    step="100"
                    value={scene.duration}
                    onChange={(e) =>
                      onUpdateScene(scene.id, {
                        duration: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 bg-dark-secondary border border-white/10 rounded text-sm text-white focus:outline-none focus:border-neon"
                  />
                </div>

                {scene.text && (
                  <div>
                    <label className="text-xs font-medium text-gray-400 block mb-1">
                      Texto
                    </label>
                    <textarea
                      value={scene.text}
                      onChange={(e) =>
                        onUpdateScene(scene.id, { text: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-dark-secondary border border-white/10 rounded text-sm text-white resize-none focus:outline-none focus:border-neon"
                      rows={2}
                    />
                  </div>
                )}

                {scene.effects?.[0] && (
                  <div>
                    <label className="text-xs font-medium text-gray-400 block mb-1">
                      Efecto
                    </label>
                    <input
                      type="text"
                      value={scene.effects?.[0]}
                      onChange={(e) =>
                        onUpdateScene(scene.id, { effects: [e.target.value] })
                      }
                      className="w-full px-3 py-2 bg-dark-secondary border border-white/10 rounded text-sm text-white focus:outline-none focus:border-neon"
                    />
                  </div>
                )}
              </div>
            ))}
        </motion.div>
      )}
    </motion.div>
  )
}
