'use client'

import { motion } from 'framer-motion'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import UploadZone from '@/components/editor/UploadZone'
import MediaList from '@/components/editor/MediaList'
import SceneForm from '@/components/editor/SceneForm'
import TimelineEditor from '@/components/editor/TimelineEditor'
import VideoPreview from '@/components/editor/VideoPreview'
import ExportModal from '@/components/editor/ExportModal'
import ExportStatusPanel from '@/components/editor/ExportStatusPanel'
import { useMediaUpload } from '@/lib/hooks/useMediaUpload'
import { useSceneGeneration } from '@/lib/hooks/useSceneGeneration'
import { useVideoExport } from '@/lib/hooks/useVideoExport'
import { supabase } from '@/lib/supabase'
import type { Project } from '@/lib/types'
import type { ExportFormat } from '@/components/editor/ExportModal'

export default function ProjectEditorPage() {
  const params = useParams()
  const projectId = params.id as string
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [selectedMediaId, setSelectedMediaId] = useState<string>()
  const router = useRouter()

  const { media, loading: uploading, uploadFiles, removeMedia } = useMediaUpload({
    projectId,
  })

  const { scenes, loading: generating, error: generatingError, generateScene, removeScene, updateScene } = useSceneGeneration({
    projectId,
    style: project?.style || 'apple',
  })

  const { exports, loading: exporting, startExport, cancelExport, fetchExports } = useVideoExport({ projectId })

  const [selectedSceneId, setSelectedSceneId] = useState<string>()
  const [isExportModalOpen, setIsExportModalOpen] = useState(false)

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (!user) {
          router.push('/auth/login')
          return
        }

        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('id', projectId)
          .eq('user_id', user.id)
          .single()

        if (error) throw error
        setProject(data)
        setTitle(data.title)
        setDescription(data.description || '')
      } catch (err) {
        console.error('Error al cargar proyecto:', err)
        router.push('/dashboard')
      } finally {
        setLoading(false)
      }
    }

    fetchProject()
    fetchExports()
  }, [projectId, router])

  // Poll for export status updates
  useEffect(() => {
    const interval = setInterval(() => {
      fetchExports()
    }, 2000)

    return () => clearInterval(interval)
  }, [projectId])

  const handleUpload = async (files: File[]) => {
    const uploaded = await uploadFiles(new DataTransfer().items.add(...files).files)
    if (uploaded.length > 0 && !selectedMediaId) {
      setSelectedMediaId(uploaded[0].id)
    }
  }

  const handleGenerateScene = async (data: {
    headline: string
    subtitle: string
    description: string
  }) => {
    await generateScene(data)
  }

  const handleStartExport = async (format: ExportFormat) => {
    if (scenes.length === 0) {
      alert('Por favor genera escenas primero')
      return
    }

    await startExport(format)
    setIsExportModalOpen(false)
  }

  const handleCancelExport = async (exportId: string) => {
    await cancelExport(exportId)
  }

  const handleSaveProject = async () => {
    if (!project) return

    setSaving(true)
    try {
      const { error } = await supabase
        .from('projects')
        .update({
          title,
          description,
          updated_at: new Date().toISOString(),
        })
        .eq('id', projectId)

      if (error) throw error
      setProject({ ...project, title, description })
      alert('¡Proyecto guardado!')
    } catch (err) {
      console.error('Error al guardar:', err)
      alert('Error al guardar proyecto')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-dark flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin text-4xl mb-4">⏳</div>
          <p className="text-gray-400">Cargando editor...</p>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-dark flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400">Proyecto no encontrado</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-dark">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-xl bg-dark/50 sticky top-0 z-40">
        <div className="max-w-full mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">{title}</h1>
            <p className="text-sm text-gray-400">Estilo: {project.style}</p>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" onClick={() => router.push('/dashboard')}>
              Atrás
            </Button>
            <Button
              variant="secondary"
              onClick={() => setIsExportModalOpen(true)}
              disabled={scenes.length === 0 || exporting}
            >
              📦 Exportar
            </Button>
            <Button
              variant="primary"
              onClick={handleSaveProject}
              disabled={saving}
            >
              {saving ? 'Guardando...' : 'Guardar'}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Editor */}
      <main className="p-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Panel - Upload & Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1 space-y-6"
          >
            {/* Project Info */}
            <div className="glassmorphism p-6 rounded-xl">
              <h3 className="font-semibold mb-4">Información del Proyecto</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Título</label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Título del proyecto"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Descripción</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe tu video..."
                    className="w-full px-4 py-2.5 bg-dark-secondary border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon transition-all resize-none"
                    rows={3}
                  />
                </div>
              </div>
            </div>

            {/* Upload Zone */}
            <div>
              <h3 className="font-semibold mb-3 text-sm">Subir Media</h3>
              <UploadZone onFilesSelected={handleUpload} loading={uploading} />
            </div>

            {/* Media List */}
            {media.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3 text-sm">Archivos Subidos</h3>
                <MediaList
                  media={media}
                  onRemove={removeMedia}
                  selectedId={selectedMediaId}
                  onSelect={setSelectedMediaId}
                  loading={uploading}
                />
              </div>
            )}
          </motion.div>

          {/* Center - Preview & Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1 space-y-6"
          >
            {/* Video Preview with Scene Playback */}
            <VideoPreview scenes={scenes} />

            {/* Timeline Editor */}
            <TimelineEditor
              scenes={scenes}
              selectedSceneId={selectedSceneId}
              onSelectScene={setSelectedSceneId}
              onRemoveScene={removeScene}
              onUpdateScene={updateScene}
            />
          </motion.div>

          {/* Right Panel - Scene Generator & Exports */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1 space-y-6"
          >
            <SceneForm
              style={project.style}
              onGenerateScene={handleGenerateScene}
              isGenerating={generating}
              error={generatingError}
            />

            <ExportStatusPanel
              exports={exports}
              isLoading={exporting}
              onCancelExport={handleCancelExport}
              onRefresh={fetchExports}
            />
          </motion.div>
        </div>
      </main>

      {/* Export Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onExport={handleStartExport}
        isLoading={exporting}
      />
    </div>
  )
}
