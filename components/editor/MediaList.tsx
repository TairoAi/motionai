'use client'

import { motion, AnimatePresence } from 'framer-motion'
import MediaPreview from './MediaPreview'

interface MediaItem {
  id: string
  url: string
  type: 'image' | 'video'
  name: string
  size: number
  duration?: number
  thumbnail?: string
}

interface MediaListProps {
  media: MediaItem[]
  onRemove: (id: string) => void
  selectedId?: string
  onSelect?: (id: string) => void
  loading?: boolean
}

export default function MediaList({
  media,
  onRemove,
  selectedId,
  onSelect,
  loading = false,
}: MediaListProps) {
  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin text-2xl mb-2">⏳</div>
        <p className="text-gray-400 text-sm">Subiendo archivos...</p>
      </div>
    )
  }

  if (media.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        <div className="text-3xl mb-2">📤</div>
        <p className="text-sm">Sube archivos para empezar</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-sm">
        Archivos Subidos ({media.length})
      </h3>
      <div className="grid grid-cols-2 gap-3">
        <AnimatePresence>
          {media.map((item) => (
            <motion.div
              key={item.id}
              onClick={() => onSelect?.(item.id)}
              className="cursor-pointer"
            >
              <MediaPreview
                media={item}
                onRemove={onRemove}
                isSelected={selectedId === item.id}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
