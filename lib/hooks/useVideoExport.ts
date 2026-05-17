'use client'

import { useState, useEffect } from 'react'
import type { Export } from '@/lib/types'

interface UseVideoExportProps {
  projectId: string
}

export function useVideoExport({ projectId }: UseVideoExportProps) {
  const [exports, setExports] = useState<Export[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const startExport = async (format: string): Promise<void> => {
    try {
      setLoading(true)
      setError('')

      const response = await fetch('/api/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId, format }),
      })

      if (!response.ok) throw new Error('Error iniciando exportación')

      const data = await response.json()
      setExports((prev) => [{ id: data.id, projectId, format, status: 'queued' } as Export, ...prev])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const checkExportStatus = async (exportId: string): Promise<void> => {
    try {
      const response = await fetch(`/api/exports/${exportId}`)
      if (!response.ok) throw new Error('Error fetching export status')

      const data = await response.json()
      setExports((prev) =>
        prev.map((e) => (e.id === exportId ? { ...e, ...data.export } : e))
      )
    } catch (err) {
      console.error('Error checking export status:', err)
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

  const fetchExports = async (): Promise<void> => {
    try {
      const response = await fetch(`/api/exports?projectId=${projectId}`)

      if (!response.ok) {
        throw new Error('Error al obtener exportaciones')
      }

      const data = await response.json()
      setExports(data.exports || [])
    } catch (err) {
      console.error('Error fetching exports:', err)
    }
  }

  useEffect(() => {
    fetchExports()
    const interval = setInterval(() => {
      exports.forEach((exp) => {
        if (exp.status !== 'completed' && exp.status !== 'failed') {
          checkExportStatus(exp.id)
        }
      })
    }, 3000)

    return () => clearInterval(interval)
  }, [projectId])

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
