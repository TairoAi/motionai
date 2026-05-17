'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import type { Export } from '@/lib/types'
import Button from '@/components/ui/Button'

interface ExportStatusPanelProps {
  exports: Export[]
  isLoading: boolean
  onCancelExport: (exportId: string) => Promise<void>
  onRefresh: () => Promise<void>
}

const FORMAT_INFO: Record<string, { emoji: string; label: string }> = {
  mp4_1080p: { emoji: '🎬', label: 'MP4 1080p' },
  vertical_reels: { emoji: '📱', label: 'Instagram Reels' },
  youtube: { emoji: '▶️', label: 'YouTube' },
  square: { emoji: '⬜', label: 'Square' },
}

const STATUS_COLOR: Record<string, string> = {
  queued: 'text-yellow-400',
  processing: 'text-blue-400',
  completed: 'text-green-400',
  failed: 'text-red-400',
}

const STATUS_ICON: Record<string, string> = {
  queued: '⏳',
  processing: '⚙️',
  completed: '✅',
  failed: '❌',
}

export default function ExportStatusPanel({
  exports,
  isLoading,
  onCancelExport,
  onRefresh,
}: ExportStatusPanelProps) {
  const [canceling, setCanceling] = useState<string | null>(null)

  const handleCancel = async (exportId: string) => {
    setCanceling(exportId)
    await onCancelExport(exportId)
    setCanceling(null)
  }

  if (exports.length === 0) {
    return (
      <div className="glassmorphism p-6 rounded-xl text-center">
        <div className="text-3xl mb-3">📦</div>
        <p className="text-gray-400 text-sm">
          No hay exportaciones aún. ¡Crea tu primer video!
        </p>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="glassmorphism p-6 rounded-xl space-y-4"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Historial de Exportaciones</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onRefresh}
          disabled={isLoading}
        >
          {isLoading ? '⏳' : '🔄'} Actualizar
        </Button>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        <AnimatePresence>
          {exports.map((exp) => {
            const formatInfo = FORMAT_INFO[exp.format] || { emoji: '❓', label: exp.format }
            const statusColor = STATUS_COLOR[exp.status] || 'text-gray-400'
            const statusIcon = STATUS_ICON[exp.status] || '❓'

            return (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="p-4 bg-white/5 border border-white/10 rounded-lg space-y-3"
              >
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{formatInfo.emoji}</span>
                    <div>
                      <p className="font-semibold text-sm">{formatInfo.label}</p>
                      <p className={`text-xs ${statusColor}`}>
                        {statusIcon} {exp.status.toUpperCase()}
                      </p>
                    </div>
                  </div>

                  {exp.status === 'queued' || exp.status === 'processing' ? (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleCancel(exp.id)}
                      disabled={canceling === exp.id}
                      className="text-xs px-2 py-1 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 disabled:opacity-50"
                    >
                      {canceling === exp.id ? 'Cancelando...' : 'Cancelar'}
                    </motion.button>
                  ) : exp.status === 'completed' && exp.videoUrl ? (
                    <motion.a
                      whileHover={{ scale: 1.05 }}
                      href={exp.videoUrl}
                      download
                      className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded hover:bg-green-500/30"
                    >
                      ⬇️ Descargar
                    </motion.a>
                  ) : null}
                </div>

                {/* Progress */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-400">Progreso</span>
                    <span className={`${statusColor}`}>{exp.progress}%</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-neon via-cyan-400 to-neon"
                      animate={{ width: `${exp.progress}%` }}
                      transition={{ type: 'tween', duration: 0.3 }}
                    />
                  </div>
                </div>

                {/* Footer */}
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>{new Date(exp.createdAt).toLocaleString('es-ES')}</span>
                  {exp.errorMessage && (
                    <span className="text-red-400">{exp.errorMessage}</span>
                  )}
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
