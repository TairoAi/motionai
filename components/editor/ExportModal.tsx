'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Button from '@/components/ui/Button'

export type ExportFormat = 'mp4_1080p' | 'vertical_reels' | 'youtube' | 'square'

interface ExportOption {
  id: ExportFormat
  name: string
  description: string
  icon: string
  dimensions: string
  estimated_time: string
}

const EXPORT_OPTIONS: ExportOption[] = [
  {
    id: 'mp4_1080p',
    name: 'MP4 1080p',
    description: 'Formato estándar de alta calidad',
    icon: '🎬',
    dimensions: '1920 x 1080',
    estimated_time: '2-3 min',
  },
  {
    id: 'vertical_reels',
    name: 'Instagram Reels',
    description: 'Optimizado para Reels e historias',
    icon: '📱',
    dimensions: '1080 x 1920',
    estimated_time: '1-2 min',
  },
  {
    id: 'youtube',
    name: 'YouTube',
    description: 'Optimizado para YouTube con máxima calidad',
    icon: '▶️',
    dimensions: '2560 x 1440 (2K)',
    estimated_time: '4-5 min',
  },
  {
    id: 'square',
    name: 'Square (1:1)',
    description: 'Perfecto para TikTok y otros',
    icon: '⬜',
    dimensions: '1080 x 1080',
    estimated_time: '1-2 min',
  },
]

interface ExportModalProps {
  isOpen: boolean
  onClose: () => void
  onExport: (format: ExportFormat) => Promise<void>
  isLoading: boolean
}

export default function ExportModal({
  isOpen,
  onClose,
  onExport,
  isLoading,
}: ExportModalProps) {
  const handleExport = async (format: ExportFormat) => {
    await onExport(format)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
          >
            <div className="glassmorphism rounded-xl border border-white/10 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="p-6 border-b border-white/10">
                <h2 className="text-2xl font-bold">Exportar Video</h2>
                <p className="text-sm text-gray-400 mt-1">
                  Elige el formato y resolución para tu video
                </p>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                {EXPORT_OPTIONS.map((option) => (
                  <motion.button
                    key={option.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleExport(option.id)}
                    disabled={isLoading}
                    className="w-full p-4 rounded-lg border border-white/10 hover:border-neon/50 hover:bg-neon/5 transition-all text-left disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="flex items-start gap-4">
                      <div className="text-3xl">{option.icon}</div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{option.name}</h3>
                        <p className="text-sm text-gray-400 mb-2">
                          {option.description}
                        </p>
                        <div className="flex gap-4 text-xs text-gray-500">
                          <span>📐 {option.dimensions}</span>
                          <span>⏱️ ~{option.estimated_time}</span>
                        </div>
                      </div>
                      <div className="text-neon text-xl">→</div>
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-white/10 flex gap-3 justify-end">
                <Button
                  variant="outline"
                  onClick={onClose}
                  disabled={isLoading}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
