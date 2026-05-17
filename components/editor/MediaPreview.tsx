'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { formatFileSize, formatDuration } from '@/lib/utils'

interface MediaItem {
  id: string
  url: string
  type: 'image' | 'video'
  name: string
  size: number
  duration?: number
  thumbnail?: string
}

interface MediaPreviewProps {
  media: MediaItem
  onRemove?: (id: string) => void
  isSelected?: boolean
}

export default function MediaPreview({
  media,
  onRemove,
  isSelected = false,
}: MediaPreviewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={`relative group rounded-lg overflow-hidden border-2 transition-all ${
        isSelected ? 'border-neon bg-neon/10' : 'border-white/10 hover:border-neon/50'
      }`}
    >
      {/* Thumbnail */}
      <div className="relative w-full aspect-video bg-dark-secondary flex items-center justify-center">
        {media.type === 'image' ? (
          <div className="relative w-full h-full">
            <img
              src={media.url}
              alt={media.name}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="relative w-full h-full">
            {media.thumbnail ? (
              <img
                src={media.thumbnail}
                alt={media.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-dark">
                <div className="text-center">
                  <div className="text-4xl mb-2">🎬</div>
                  <p className="text-sm text-gray-400">Video</p>
                </div>
              </div>
            )}
            {/* Play icon overlay */}
            <div className="absolute inset-0 flex items-center justify-center group-hover:bg-black/30 transition-all">
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="text-5xl opacity-0 group-hover:opacity-100 transition-all"
              >
                ▶️
              </motion.div>
            </div>
          </div>
        )}

        {/* Badge */}
        <div className="absolute top-2 right-2 bg-dark/80 backdrop-blur px-2 py-1 rounded text-xs font-semibold">
          {media.type === 'image' ? '🖼️ IMG' : '🎬 VIDEO'}
        </div>
      </div>

      {/* Info */}
      <div className="p-3 space-y-2">
        <p className="text-sm font-semibold truncate">{media.name}</p>
        <div className="flex justify-between text-xs text-gray-400">
          <span>{formatFileSize(media.size)}</span>
          {media.duration && <span>{formatDuration(media.duration)}</span>}
        </div>
      </div>

      {/* Remove button */}
      {onRemove && (
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onRemove(media.id)}
          className="absolute top-2 left-2 bg-red-500/80 hover:bg-red-600 text-white rounded-full w-7 h-7 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
        >
          ✕
        </motion.button>
      )}
    </motion.div>
  )
}
