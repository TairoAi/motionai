'use client'

import { useRouter, useParams } from 'next/navigation'
import { useEffect, useState, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import type { Project } from '@/lib/types'

export default function EditorPage() {
  const router = useRouter()
  const params = useParams()
  const projectId = params.id as string
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [headline, setHeadline] = useState('')
  const [description, setDescription] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<Array<{ fileName: string; fileUrl: string; type: string; size: number }>>([])
  const [hoveredFileIndex, setHoveredFileIndex] = useState<number | null>(null)
  const [generatedScenes, setGeneratedScenes] = useState<any[]>([])
  const [generatingScenes, setGeneratingScenes] = useState(false)
  const [sceneError, setSceneError] = useState('')
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
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
        setHeadline(data.data?.headline ?? '')
        setDescription(data.data?.description ?? '')
        if (Array.isArray(data.data?.media)) {
          setUploadedFiles(
            data.data.media.map((url: string) => ({
              fileName: url.split('/').pop() ?? url,
              fileUrl: url,
              type: /\.(mp4|webm|mov)(\?|$)/i.test(url) ? 'video/*' : 'image/*',
              size: 0,
            }))
          )
        }
        if (data.data?.scenes) setGeneratedScenes(data.data.scenes)
      } catch (err) {
        console.error('Error:', err)
        router.push('/dashboard')
      } finally {
        setLoading(false)
      }
    }

    fetchProject()
  }, [projectId, router])

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files
    if (!files) return

    setUploading(true)
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const formData = new FormData()
        formData.append('file', file)
        formData.append('projectId', projectId)

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        })

        if (!response.ok) {
          throw new Error('Upload failed')
        }

        const data = await response.json()
        setUploadedFiles(prev => [...prev, {
          fileName: data.fileName,
          fileUrl: data.fileUrl,
          type: data.type,
          size: data.size
        }])
      }
      setNotification({ type: 'success', message: '✓ Archivo(s) subido(s) correctamente' })
      setTimeout(() => setNotification(null), 2000)
    } catch (err) {
      console.error('Upload error:', err)
      setNotification({ type: 'error', message: 'Error al subir archivo' })
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleSaveProject = async () => {
    if (!project || !headline.trim()) {
      setNotification({ type: 'error', message: 'Por favor ingresa un titular' })
      return
    }

    setGeneratingScenes(true)
    setSceneError('')

    try {
      // Call API to generate scenes
      const sceneResponse = await fetch('/api/generate-scene', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          style: project.style,
          headline: headline.trim(),
          subtitle: '',
          description: description.trim()
        })
      })

      if (!sceneResponse.ok) {
        const errorData = await sceneResponse.json()
        throw new Error(errorData.error || 'Error al generar escenas')
      }

      const { scenes } = await sceneResponse.json()
      setGeneratedScenes(scenes)

      // Save project with scenes
      const { error } = await supabase
        .from('projects')
        .update({
          data: {
            ...project.data,
            headline,
            description,
            media: uploadedFiles.map(f => f.fileUrl),
            scenes: scenes
          },
          updated_at: new Date().toISOString()
        })
        .eq('id', projectId)

      if (error) throw error
      setNotification({ type: 'success', message: '✓ Escenas generadas y proyecto guardado' })
      setTimeout(() => setNotification(null), 3000)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al generar escenas'
      setSceneError(message)
      console.error('Error:', err)
    } finally {
      setGeneratingScenes(false)
    }
  }

  const handleDeleteFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index))
  }

  if (loading) {
    return (
      <div style={{ backgroundColor: '#0a0e27', color: '#ffffff', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⏳</div>
          <p style={{ color: '#a0aec0', fontSize: '1.1rem' }}>Cargando proyecto...</p>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div style={{ backgroundColor: '#0a0e27', color: '#ffffff', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p>Proyecto no encontrado</p>
      </div>
    )
  }

  return (
    <div style={{ backgroundColor: '#0a0e27', color: '#ffffff', minHeight: '100vh' }}>
      {notification && (
        <div style={{
          position: 'fixed',
          top: '1rem',
          right: '1rem',
          padding: '1rem 1.5rem',
          backgroundColor: notification.type === 'success' ? 'rgba(0, 255, 136, 0.15)' : 'rgba(239, 68, 68, 0.15)',
          border: `1px solid ${notification.type === 'success' ? 'rgba(0, 255, 136, 0.5)' : 'rgba(239, 68, 68, 0.5)'}`,
          borderRadius: '0.5rem',
          color: notification.type === 'success' ? '#86efac' : '#fca5a5',
          fontSize: '0.875rem',
          zIndex: 50,
          animation: 'fadeIn 0.3s ease-in'
        }}>
          {notification.message}
        </div>
      )}
      <header style={{
        borderBottom: '1px solid rgba(0, 212, 255, 0.2)',
        backdropFilter: 'blur(10px)',
        backgroundColor: 'rgba(10, 14, 39, 0.8)',
        position: 'sticky',
        top: 0,
        zIndex: 40,
        padding: '1rem 1.5rem'
      }}>
        <div style={{
          maxWidth: '100%',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>
              {project.title}
            </h1>
            <p style={{ fontSize: '0.875rem', color: '#a0aec0' }}>
              Estilo: <span style={{ textTransform: 'capitalize', fontWeight: '600' }}>{project.style}</span>
            </p>
          </div>
          <button
            onClick={() => router.push('/dashboard')}
            style={{
              padding: '0.75rem 1.5rem',
              background: 'transparent',
              border: '1px solid rgba(0, 212, 255, 0.3)',
              color: '#a0aec0',
              fontWeight: '600',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              fontSize: '0.95rem',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0, 212, 255, 0.8)'
              ;(e.currentTarget as HTMLElement).style.color = '#00d4ff'
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0, 212, 255, 0.3)'
              ;(e.currentTarget as HTMLElement).style.color = '#a0aec0'
            }}
          >
            Volver
          </button>
        </div>
      </header>

      <main style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '2rem 1.5rem',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '2rem'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div
            onClick={() => fileInputRef.current?.click()}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '2px dashed rgba(0, 212, 255, 0.3)',
              borderRadius: '0.75rem',
              padding: '2rem',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0, 212, 255, 0.8)'
              ;(e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(0, 212, 255, 0.1)'
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0, 212, 255, 0.3)'
              ;(e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(255, 255, 255, 0.05)'
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📁</div>
            <p style={{ fontSize: '0.9rem', color: '#a0aec0', marginBottom: '0.25rem' }}>
              {uploading ? '⏳ Subiendo...' : 'Haz clic para seleccionar'}
            </p>
            <p style={{ fontSize: '0.75rem', color: '#718096' }}>
              PNG, JPG, MP4
            </p>
          </div>

          {uploadedFiles.length > 0 && (
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(0, 212, 255, 0.2)',
              borderRadius: '0.75rem',
              padding: '1.5rem',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}>
              <h3 style={{ fontSize: '0.875rem', color: '#cbd5e0', fontWeight: '600' }}>
                ✓ {uploadedFiles.length} archivo(s)
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
                gap: '0.75rem'
              }}>
                {uploadedFiles.map((file, index) => (
                  <div
                    key={index}
                    style={{
                      position: 'relative',
                      backgroundColor: 'rgba(0, 0, 0, 0.3)',
                      border: '1px solid rgba(0, 212, 255, 0.15)',
                      borderRadius: '0.5rem',
                      padding: '0.5rem',
                      transition: 'all 0.3s'
                    }}
                    onMouseEnter={() => setHoveredFileIndex(index)}
                    onMouseLeave={() => setHoveredFileIndex(null)}
                  >
                    <div style={{ textAlign: 'center', fontSize: '2rem', marginBottom: '0.25rem' }}>
                      {file.type.startsWith('image/') ? '🖼️' : '🎥'}
                    </div>
                    <p style={{
                      fontSize: '0.65rem',
                      color: '#cbd5e0',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      marginBottom: '0.25rem'
                    }}>
                      {file.fileName.substring(0, 12)}
                    </p>
                    <p style={{ fontSize: '0.6rem', color: '#718096', marginBottom: '0.5rem' }}>
                      {(file.size / 1024).toFixed(0)}KB
                    </p>
                    {hoveredFileIndex === index && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteFile(index)
                        }}
                        style={{
                          width: '100%',
                          padding: '0.3rem',
                          backgroundColor: 'rgba(239, 68, 68, 0.2)',
                          border: '1px solid rgba(239, 68, 68, 0.5)',
                          color: '#fca5a5',
                          borderRadius: '0.3rem',
                          fontSize: '0.6rem',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(239, 68, 68, 0.4)'
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(239, 68, 68, 0.2)'
                        }}
                      >
                        ✕ Eliminar
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(0, 212, 255, 0.2)',
            borderRadius: '0.75rem',
            padding: '1.5rem',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600' }}>Generador de Escenas IA</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: '600', color: '#cbd5e0' }}>
                Titular
              </label>
              <input
                type="text"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="Mi Producto Increíble"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(0, 212, 255, 0.3)',
                  borderRadius: '0.5rem',
                  padding: '0.75rem 1rem',
                  color: '#ffffff',
                  fontSize: '1rem',
                  transition: 'all 0.3s',
                  outline: 'none',
                  fontFamily: 'inherit'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(0, 212, 255, 0.8)'
                  e.currentTarget.style.backgroundColor = 'rgba(0, 212, 255, 0.1)'
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(0, 212, 255, 0.3)'
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)'
                }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: '600', color: '#cbd5e0' }}>
                Descripción
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe tu producto..."
                rows={4}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(0, 212, 255, 0.3)',
                  borderRadius: '0.5rem',
                  padding: '0.75rem 1rem',
                  color: '#ffffff',
                  fontSize: '1rem',
                  transition: 'all 0.3s',
                  outline: 'none',
                  fontFamily: 'inherit',
                  resize: 'none'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(0, 212, 255, 0.8)'
                  e.currentTarget.style.backgroundColor = 'rgba(0, 212, 255, 0.1)'
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(0, 212, 255, 0.3)'
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)'
                }}
              />
            </div>

            {sceneError && (
              <div style={{
                padding: '0.75rem',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.5)',
                borderRadius: '0.5rem',
                color: '#fca5a5',
                fontSize: '0.875rem'
              }}>
                ⚠️ {sceneError}
              </div>
            )}
            <button
              onClick={handleSaveProject}
              disabled={generatingScenes || uploading || !headline.trim()}
              style={{
                padding: '0.75rem 1.5rem',
                background: generatingScenes || uploading || !headline.trim() ? 'rgba(0, 212, 255, 0.5)' : 'linear-gradient(135deg, #00d4ff, #00ff88)',
                color: '#0a0e27',
                fontWeight: '700',
                borderRadius: '0.5rem',
                border: 'none',
                cursor: generatingScenes || uploading || !headline.trim() ? 'not-allowed' : 'pointer',
                fontSize: '1rem',
                transition: 'all 0.3s',
                opacity: generatingScenes || uploading || !headline.trim() ? 0.7 : 1
              }}
              onMouseEnter={(e) => {
                if (!generatingScenes && !uploading && headline.trim()) {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'
                  ;(e.currentTarget as HTMLElement).style.boxShadow = '0 10px 30px rgba(0, 212, 255, 0.4)'
                }
              }}
              onMouseLeave={(e) => {
                if (!generatingScenes && !uploading && headline.trim()) {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'
                  ;(e.currentTarget as HTMLElement).style.boxShadow = 'none'
                }
              }}
            >
              {generatingScenes ? '⏳ Generando...' : 'Generar Escenas'}
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(0, 212, 255, 0.2)',
            borderRadius: '0.75rem',
            padding: '1.5rem',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600' }}>Escenas Generadas</h3>
            {generatedScenes.length === 0 ? (
              <div
                style={{
                  width: '100%',
                  aspectRatio: '16 / 9',
                  borderRadius: '0.5rem',
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  border: '1px solid rgba(0, 212, 255, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🎬</div>
                  <p style={{ fontSize: '0.9rem', color: '#a0aec0' }}>
                    Las escenas aparecerán aquí
                  </p>
                </div>
              </div>
            ) : (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                maxHeight: '400px',
                overflowY: 'auto'
              }}>
                {generatedScenes.map((scene, idx) => (
                  <div
                    key={scene.id}
                    style={{
                      padding: '1rem',
                      backgroundColor: 'rgba(0, 212, 255, 0.08)',
                      border: '1px solid rgba(0, 212, 255, 0.3)',
                      borderRadius: '0.5rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.5rem'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '24px',
                        height: '24px',
                        backgroundColor: 'rgba(0, 212, 255, 0.3)',
                        borderRadius: '50%',
                        fontSize: '0.75rem',
                        fontWeight: '600'
                      }}>
                        {idx + 1}
                      </span>
                      <span style={{ fontSize: '0.875rem', color: '#cbd5e0', textTransform: 'capitalize', fontWeight: '600' }}>
                        {scene.type}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: '#718096', marginLeft: 'auto' }}>
                        {scene.duration}ms
                      </span>
                    </div>
                    {scene.text && (
                      <p style={{ fontSize: '0.85rem', color: '#a0aec0', marginLeft: '32px' }}>
                        "{scene.text}"
                      </p>
                    )}
                    {scene.effect && (
                      <p style={{ fontSize: '0.75rem', color: '#718096', marginLeft: '32px' }}>
                        Efecto: {scene.effect}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(0, 212, 255, 0.2)',
            borderRadius: '0.75rem',
            padding: '1.5rem',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600' }}>Información</h3>

            <div>
              <p style={{ fontSize: '0.875rem', color: '#a0aec0', marginBottom: '0.25rem' }}>
                Estado
              </p>
              <p style={{ textTransform: 'capitalize', fontWeight: '600' }}>
                {project.status}
              </p>
            </div>

            <div>
              <p style={{ fontSize: '0.875rem', color: '#a0aec0', marginBottom: '0.25rem' }}>
                Creado
              </p>
              <p style={{ fontSize: '0.9rem' }}>
                {new Date(project.created_at).toLocaleDateString('es-ES')}
              </p>
            </div>

            <button
              style={{
                padding: '0.75rem 1.5rem',
                background: 'linear-gradient(135deg, #00d4ff, #00ff88)',
                color: '#0a0e27',
                fontWeight: '700',
                borderRadius: '0.5rem',
                border: 'none',
                cursor: 'pointer',
                fontSize: '1rem',
                transition: 'all 0.3s',
                marginTop: '0.5rem'
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'
                ;(e.currentTarget as HTMLElement).style.boxShadow = '0 10px 30px rgba(0, 212, 255, 0.4)'
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'
                ;(e.currentTarget as HTMLElement).style.boxShadow = 'none'
              }}
            >
              📥 Exportar
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
