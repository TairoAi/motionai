import { useState } from 'react'

export interface Media {
  id: string
  name: string
  size: number
  type: 'image' | 'video'
  url: string
  duration?: number
}

interface UseMediaUploadProps {
  projectId: string
}

export function useMediaUpload({ projectId }: UseMediaUploadProps) {
  const [media, setMedia] = useState<Media[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [progress, setProgress] = useState(0)

  const uploadFiles = async (files: FileList): Promise<Media[]> => {
    setLoading(true)
    setError('')
    setProgress(0)

    const uploadedMedia: Media[] = []

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const formData = new FormData()
        formData.append('file', file)
        formData.append('projectId', projectId)

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) {
          const data = await response.json()
          setError(data.error || `Error al subir ${file.name}`)
          continue
        }

        const data = await response.json()
        const newMedia: Media = {
          id: data.id,
          name: file.name,
          size: file.size,
          type: file.type.startsWith('image/') ? 'image' : 'video',
          url: data.url,
          duration: data.duration,
        }

        uploadedMedia.push(newMedia)
        setMedia((prev) => [...prev, newMedia])
        setProgress(Math.round(((i + 1) / files.length) * 100))
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error desconocido'
      setError(message)
    } finally {
      setLoading(false)
      setProgress(0)
    }

    return uploadedMedia
  }

  const removeMedia = (mediaId: string) => {
    setMedia((prev) => prev.filter((m) => m.id !== mediaId))
  }

  const clearAll = () => {
    setMedia([])
    setError('')
  }

  return {
    media,
    loading,
    error,
    progress,
    uploadFiles,
    removeMedia,
    clearAll,
  }
}
