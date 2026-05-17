'use client'

import { motion } from 'framer-motion'
import type { Scene } from '@/lib/types'

interface ScenePreviewCardProps {
  scene: Scene
  index: number
  isSelected: boolean
  onSelect: () => void
  onDelete: () => void
}

const SCENE_TYPE_INFO: Record<
  string,
  { label: string; emoji: string; color: string; bgGradient: string }
> = {
  title: {
    label: 'Título',
    emoji: '🎬',
    color: 'text-blue-400',
    bgGradient: 'from-blue-900/20 to-blue-800/10',
  },
  transition: {
    label: 'Transición',
    emoji: '✨',
    color: 'text-purple-400',
    bgGradient: 'from-purple-900/20 to-purple-800/10',
  },
  media: {
    label: 'Media',
    emoji: '🖼️',
    color: 'text-cyan-400',
    bgGradient: 'from-cyan-900/20 to-cyan-800/10',
  },
  text: {
    label: 'Texto',
    emoji: '📝',
    color: 'text-green-400',
    bgGradient: 'from-green-900/20 to-green-800/10',
  },
  effect: {
    label: 'Efecto',
    emoji: '⚡',
    color: 'text-orange-400',
    bgGradient: 'from-orange-900/20 to-orange-800/10',
  },
}

export default function ScenePreviewCard({
  scene,
  index,
  isSelected,
  onSelect,
  onDelete,
}: ScenePreviewCardProps) {
  const info = SCENE_TYPE_INFO[scene.type] || SCENE_TYPE_INFO.transition

  return (
    <motion.div
      layoutId={`scene-${scene.id}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      onClick={onSelect}
      className={`relative group rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
        isSelected
          ? 'border-neon bg-neon/5'
          : 'border-white/10 hover:border-white/30'
      }`}
    >
      {/* Background Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${info.bgGradient}`} />

      {/* Content */}
      <div className="relative p-4 space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{info.emoji}</span>
            <div>
              <p className={`text-sm font-semibold ${info.color}`}>{info.label}</p>
              <p className="text-xs text-gray-500">#{index + 1}</p>
            </div>
          </div>

          {/* Delete Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation()
              onDelete()
            }}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-500/20 rounded text-red-400 text-lg"
          >
            ✕
          </motion.button>
        </div>

        {/* Text Content */}
        {scene.text && (
          <div className="space-y-1">
            <p className="text-xs text-gray-400">Contenido:</p>
            <p className="text-sm font-medium text-white truncate">{scene.text}</p>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-white/10">
          <span className="text-xs text-gray-400">
            {Math.round(scene.duration / 1000)}s
          </span>
          {scene.effect && (
            <span className="text-xs px-2 py-1 bg-white/10 rounded text-gray-300">
              {scene.effect}
            </span>
          )}
        </div>
      </div>

      {/* Selected Indicator */}
      {isSelected && (
        <motion.div
          layoutId="selected-border"
          className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-neon via-cyan-400 to-neon"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ type: 'spring', stiffness: 100 }}
        />
      )}
    </motion.div>
  )
}
