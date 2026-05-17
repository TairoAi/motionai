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
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([])

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
        setUploadedFiles(prev => [...prev, data.fileUrl])
      }
      alert('✓ Archivo(s) subido(s) correctamente')
    } catch (err) {
      console.error('Upload error:', err)
      alert('Error al subir archivo')
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleSaveProject = async () => {
    if (!project) return
    setSaving(true)
    try {
      const { error } = await supabase
        .from('projects')
        .update({
          data: {
            ...project.data,
            headline,
            description,
            media: uploadedFiles,
          },
          updated_at: new Date().toISOString()
        })
        .eq('id', projectId)

      if (error) throw error
      alert('✓ Proyecto guardado')
    } catch (err) {
      console.error('Error saving:', err)
      alert('Error al guardar')
    } finally {
      setSaving(false)
    }
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
              padding: '1rem',
              backdropFilter: 'blur(10px)'
            }}>
              <p style={{ fontSize: '0.875rem', color: '#cbd5e0', marginBottom: '0.75rem', fontWeight: '600' }}>
                ✓ {uploadedFiles.length} archivo(s)
              </p>
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

            <button
              onClick={handleSaveProject}
              disabled={saving || uploading}
              style={{
                padding: '0.75rem 1.5rem',
                background: saving || uploading ? 'rgba(0, 212, 255, 0.5)' : 'linear-gradient(135deg, #00d4ff, #00ff88)',
                color: '#0a0e27',
                fontWeight: '700',
                borderRadius: '0.5rem',
                border: 'none',
                cursor: saving || uploading ? 'not-allowed' : 'pointer',
                fontSize: '1rem',
                transition: 'all 0.3s',
                opacity: saving || uploading ? 0.7 : 1
              }}
              onMouseEnter={(e) => {
                if (!saving && !uploading) {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'
                  ;(e.currentTarget as HTMLElement).style.boxShadow = '0 10px 30px rgba(0, 212, 255, 0.4)'
                }
              }}
              onMouseLeave={(e) => {
                if (!saving && !uploading) {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'
                  ;(e.currentTarget as HTMLElement).style.boxShadow = 'none'
                }
              }}
            >
              {saving ? 'Guardando...' : 'Generar Escenas'}
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
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600' }}>Vista Previa</h3>
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
                  Vista previa aquí
                </p>
              </div>
            </div>
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
