'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { STYLE_PRESETS } from '@/lib/constants'
import type { Style } from '@/lib/types'

export default function NewProjectPage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [selectedStyle, setSelectedStyle] = useState<Style>('apple')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [hoveredStyle, setHoveredStyle] = useState<string | null>(null)

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    setLoading(true)
    setError('')

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/login')
        return
      }

      const { data, error: dbError } = await supabase
        .from('projects')
        .insert({
          user_id: user.id,
          title: title.trim(),
          description: description.trim(),
          style: selectedStyle,
          status: 'draft',
          data: { scenes: [], timeline: [], effects: {} },
        })
        .select()
        .single()

      if (dbError) throw dbError

      router.push(`/dashboard/${data.id}`)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al crear proyecto'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ backgroundColor: '#0a0e27', color: '#ffffff', minHeight: '100vh' }}>
      {/* Header */}
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
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Nuevo Proyecto</h1>
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
            Cancelar
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '3rem 1.5rem'
      }}>
        <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Project Info Section */}
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(0, 212, 255, 0.2)',
            borderRadius: '0.75rem',
            padding: '1.5rem',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem'
          }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: '600' }}>Información del Proyecto</h2>

            {/* Title Input */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: '600', color: '#cbd5e0' }}>
                Título *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Mi Video Promo Increíble"
                disabled={loading}
                autoFocus
                required
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

            {/* Description Input */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: '600', color: '#cbd5e0' }}>
                Descripción
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe brevemente tu proyecto..."
                disabled={loading}
                rows={3}
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
          </div>

          {/* Style Selection Section */}
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(0, 212, 255, 0.2)',
            borderRadius: '0.75rem',
            padding: '1.5rem',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem'
          }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: '600' }}>Elige un Estilo</h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem'
            }}>
              {Object.entries(STYLE_PRESETS).map(([key, preset]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSelectedStyle(key as Style)}
                  style={{
                    padding: '1rem',
                    borderRadius: '0.5rem',
                    border: selectedStyle === key ? '2px solid #00d4ff' : '1px solid rgba(0, 212, 255, 0.2)',
                    backgroundColor: selectedStyle === key ? 'rgba(0, 212, 255, 0.15)' : hoveredStyle === key ? 'rgba(0, 212, 255, 0.08)' : 'rgba(255, 255, 255, 0.04)',
                    color: '#ffffff',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.3s'
                  }}
                  onMouseEnter={() => setHoveredStyle(key)}
                  onMouseLeave={() => setHoveredStyle(null)}
                >
                  <h3 style={{ fontWeight: '600', marginBottom: '0.25rem' }}>{preset.name}</h3>
                  <p style={{ fontSize: '0.875rem', color: '#a0aec0' }}>{preset.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Style Preview */}
          {selectedStyle && (
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
              <h3 style={{ fontWeight: '600' }}>Vista Previa del Estilo</h3>
              <div
                style={{
                  height: '150px',
                  borderRadius: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: STYLE_PRESETS[selectedStyle]?.colors?.background || '#000000'
                }}
              >
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: '0.875rem', opacity: 0.75, color: STYLE_PRESETS[selectedStyle]?.colors?.text || '#ffffff', marginBottom: '0.5rem' }}>
                    {STYLE_PRESETS[selectedStyle]?.name}
                  </p>
                  <p style={{ fontSize: '1.125rem', fontWeight: '600', color: STYLE_PRESETS[selectedStyle]?.colors?.text || '#ffffff' }}>
                    Ejemplo de Video
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div style={{
              padding: '1rem',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.5)',
              borderRadius: '0.5rem',
              color: '#fca5a5',
              fontSize: '0.875rem'
            }}>
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !title.trim()}
            style={{
              padding: '0.75rem 1.5rem',
              background: loading || !title.trim() ? 'rgba(0, 212, 255, 0.5)' : 'linear-gradient(135deg, #00d4ff, #00ff88)',
              color: '#0a0e27',
              fontWeight: '700',
              borderRadius: '0.5rem',
              border: 'none',
              cursor: loading || !title.trim() ? 'not-allowed' : 'pointer',
              fontSize: '1rem',
              transition: 'all 0.3s',
              opacity: loading || !title.trim() ? 0.7 : 1
            }}
            onMouseEnter={(e) => {
              if (!loading && title.trim()) {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'
                ;(e.currentTarget as HTMLElement).style.boxShadow = '0 10px 30px rgba(0, 212, 255, 0.4)'
              }
            }}
            onMouseLeave={(e) => {
              if (!loading && title.trim()) {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'
                ;(e.currentTarget as HTMLElement).style.boxShadow = 'none'
              }
            }}
          >
            {loading ? 'Creando...' : 'Crear Proyecto'}
          </button>
        </form>
      </main>
    </div>
  )
}
