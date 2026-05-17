import { useState } from 'react'
import type { ExportFormat } from '@/components/editor/ExportModal'

export interface Export {
  id: string
  projectId: string
  format: ExportFormat
  status: 'queued' | 'processing' | 'completed' | 'failed'
  videoUrl?: string
  errorMessage?: string
  progress: number
  createdAt: string
  completedAt?: string
}

interface UseVideoExportProps {
  projectId: string
}

export function useVideoExport({ projectId }: UseVideoExportProps) {
  const [exports, setExports] = useState<Export[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const startExport = async (format: ExportFormat): Promise<Export | null> => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId, format }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Error al iniciar exportación')
      }

      const data = await response.json()
      const newExport: Export = data.export

      setExports((prev) => [newExport, ...prev])
      return newExport
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error desconocido'
      setError(message)
      return null
    } finally {
      setLoading(false)
    }
  }

  const checkExportStatus = async (exportId: string): Promise<Export | null> => {
    try {
      const response = await fetch(`/api/exports/${exportId}`)

      if (!response.ok) {
        throw new Error('Error al obtener estado')
      }

      const data = await response.json()
      const updatedExport: Export = data.export

      setExports((prev) =>
        prev.map((e) => (e.id === exportId ? updatedExport : e))
      )

      return updatedExport
    } catch (err) {
      console.error('Error checking export status:', err)
      return null
    }
  }

  const cancelExport = async (exportId: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/exports/${exportId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Error al cancelar')
      }

      setExports((prev) => prev.filter((e) => e.id !== exportId))
      return true
    } catch (err) {
      console.error('Error canceling export:', err)
      return false
    }
  }

  const fetchExports = async (): Promise<Export[]> => {
    try {
      const response = await fetch(`/api/exports?projectId=${projectId}`)

      if (!response.ok) {
        throw new Error('Error al obtener exportaciones')
      }

      const data = await response.json()
      setExports(data.exports || [])
      return data.exports || []
    } catch (err) {
      console.error('Error fetching exports:', err)
      return []
    }
  }

  return {
    exports,
    loading,
    error,
    startExport,
    checkExportStatus,
    cancelExport,
    fetchExports,
  }
}
