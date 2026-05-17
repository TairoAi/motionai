'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import type { Scene } from '@/lib/types'

interface VideoPreviewProps {
  scenes: Scene[]
  isPlaying?: boolean
  onPlayPause?: (playing: boolean) => void
}

export default function VideoPreview({
  scenes,
  isPlaying = false,
  onPlayPause,
}: VideoPreviewProps) {
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const [playing, setPlaying] = useState(isPlaying)

  const totalDuration = scenes.reduce((sum, s) => sum + s.duration, 0)
  const currentScene = scenes[currentSceneIndex]

  // Simular reproducción de video
  useEffect(() => {
    if (!playing || scenes.length === 0) return

    const startTime = Date.now()
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime
      const progressPercent = (elapsed / totalDuration) * 100

      if (progressPercent >= 100) {
        setPlaying(false)
        setProgress(0)
        setCurrentSceneIndex(0)
      } else {
        setProgress(progressPercent)

        // Calcular cuál escena debe estar mostrandose
        let accumulatedTime = 0
        for (let i = 0; i < scenes.length; i++) {
          accumulatedTime += scenes[i].duration
          if (elapsed < accumulatedTime) {
            setCurrentSceneIndex(i)
            break
          }
        }
      }
    }, 30)

    return () => clearInterval(interval)
  }, [playing, scenes, totalDuration])

  useEffect(() => {
    onPlayPause?.(playing)
  }, [playing, onPlayPause])

  if (scenes.length === 0) {
    return (
      <div className="glassmorphism p-6 rounded-xl">
        <div className="aspect-video bg-dark-secondary rounded-lg flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">🎬</div>
            <p className="text-gray-400">Genera escenas para ver preview</p>
          </div>
        </div>
      </div>
    )
  }

  const SCENE_COLORS: Record<string, string> = {
    title: 'from-blue-600 to-blue-800',
    transition: 'from-purple-600 to-purple-800',
    media: 'from-cyan-600 to-cyan-800',
    text: 'from-green-600 to-green-800',
    effect: 'from-orange-600 to-orange-800',
  }

  const SCENE_ICONS: Record<string, string> = {
    title: '🎬',
    transition: '✨',
    media: '🖼️',
    text: '📝',
    effect: '⚡',
  }

  const bgGradient = SCENE_COLORS[currentScene?.type] || SCENE_COLORS.transition

  return (
    <div className="glassmorphism p-6 rounded-xl space-y-4">
      {/* Video Preview */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`aspect-video bg-gradient-to-br ${bgGradient} rounded-lg flex items-center justify-center overflow-hidden relative`}
      >
        <div className="text-center z-10">
          <motion.div
            key={currentSceneIndex}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            transition={{ duration: 0.3 }}
            className="text-6xl mb-4"
          >
            {SCENE_ICONS[currentScene?.type] || '❓'}
          </motion.div>

          {currentScene?.text && (
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-2xl font-bold text-white mb-2"
            >
              {currentScene.text}
            </motion.h2>
          )}

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-sm text-white/80"
          >
            Escena {currentSceneIndex + 1} de {scenes.length}
          </motion.p>
        </div>

        {/* Animated background */}
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute inset-0 bg-white/10"
        />
      </motion.div>

      {/* Controls */}
      <div className="space-y-3">
        {/* Play/Pause Button */}
        <button
          onClick={() => setPlaying(!playing)}
          className="w-full px-4 py-3 bg-neon text-dark font-semibold rounded-lg hover:bg-neon/90 transition-all flex items-center justify-center gap-2"
        >
          {playing ? '⏸ Pausar' : '▶ Reproducir'}
        </button>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-neon via-cyan-400 to-neon"
              animate={{ width: `${progress}%` }}
              transition={{ type: 'tween', duration: 0.05 }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-400">
            <span>{Math.round((progress / 100) * (totalDuration / 1000))}s</span>
            <span>{Math.round(totalDuration / 1000)}s</span>
          </div>
        </div>

        {/* Scene Info */}
        <div className="p-3 bg-white/5 rounded-lg border border-white/10">
          <p className="text-xs font-medium text-gray-400 mb-1">ESCENA ACTUAL</p>
          <p className="text-sm font-semibold">
            {currentScene?.type === 'title'
              ? '🎬 Título'
              : currentScene?.type === 'transition'
              ? '✨ Transición'
              : currentScene?.type === 'media'
              ? '🖼️ Media'
              : currentScene?.type === 'text'
              ? '📝 Texto'
              : '⚡ Efecto'}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {currentScene?.duration}ms
            {currentScene?.effect && ` • ${currentScene.effect}`}
          </p>
        </div>
      </div>
    </div>
  )
}
