'use client'

import { motion } from 'framer-motion'
import { useRef, useState } from 'react'
import { SUPPORTED_FORMATS, MAX_FILE_SIZE } from '@/lib/constants'
import { formatFileSize } from '@/lib/utils'

interface UploadZoneProps {
  onFilesSelected: (files: File[]) => void
  loading?: boolean
}

export default function UploadZone({ onFilesSelected, loading = false }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const validateFiles = (files: FileList): File[] => {
    const validFiles: File[] = []
    setError('')

    for (let i = 0; i < files.length; i++) {
      const file = files[i]

      if (!SUPPORTED_FORMATS.includes(file.type)) {
        setError(
          `Tipo inválido: ${file.name}. Permitidos: PNG, JPG, MP4, WebM`
        )
        continue
      }

      if (file.size > MAX_FILE_SIZE) {
        setError(`Archivo muy grande: ${file.name}. Máx: ${formatFileSize(MAX_FILE_SIZE)}`)
        continue
      }

      validFiles.push(file)
    }

    return validFiles
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const files = validateFiles(e.dataTransfer.files)
    if (files.length > 0) {
      onFilesSelected(files)
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = validateFiles(e.target.files)
      if (files.length > 0) {
        onFilesSelected(files)
      }
    }
  }

  const handleClick = () => {
    if (!loading) {
      inputRef.current?.click()
    }
  }

  return (
    <motion.div
      onDragOver={(e) => {
        e.preventDefault()
        setIsDragging(true)
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={`relative border-2 border-dashed rounded-xl p-8 transition-all cursor-pointer ${
        isDragging
          ? 'border-neon bg-neon/10'
          : 'border-neon/30 hover:border-neon/60 bg-transparent'
      } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
      onClick={handleClick}
      whileHover={!loading ? { scale: 1.01 } : {}}
      whileTap={!loading ? { scale: 0.99 } : {}}
    >
      <input
        ref={inputRef}
        type="file"
        multiple
        accept={SUPPORTED_FORMATS.join(',')}
        onChange={handleFileInput}
        className="hidden"
        disabled={loading}
      />

      <div className="text-center pointer-events-none">
        <motion.div
          animate={isDragging ? { scale: 1.1, y: -5 } : { scale: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="text-5xl mb-4"
        >
          📤
        </motion.div>
        <h3 className="font-semibold text-lg mb-1">
          {loading ? 'Subiendo...' : 'Arrastra archivos aquí'}
        </h3>
        <p className="text-gray-400 text-sm mb-3">
          {loading ? 'Por favor espera' : 'o haz clic para seleccionar'}
        </p>
        <p className="text-xs text-gray-500">
          PNG, JPG, MP4, WebM • Máx {formatFileSize(MAX_FILE_SIZE)}
        </p>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm text-center"
        >
          {error}
        </motion.div>
      )}

      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-dark/50 rounded-xl flex items-center justify-center"
        >
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="inline-block mb-2 text-2xl"
            >
              ⏳
            </motion.div>
            <p className="text-sm text-gray-400">Subiendo...</p>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}
