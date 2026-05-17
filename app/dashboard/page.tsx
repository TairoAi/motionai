'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import type { Project } from '@/lib/types'

export default function DashboardPage() {
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [hoveredProject, setHoveredProject] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          router.push('/auth/login')
          return
        }

        setUser(user)

        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        if (error) throw error
        setProjects(data || [])
      } catch (err) {
        console.error('Error al cargar proyectos:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
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
          alignItems: 'center',
          gap: '1rem'
        }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #00d4ff, #00ff88)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              ✨ MotionAI
            </div>
          </Link>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', flex: 1 }}>Mis Proyectos</h1>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <button
              onClick={() => router.push('/dashboard/new')}
              style={{
                padding: '0.75rem 1.5rem',
                background: 'linear-gradient(135deg, #00d4ff, #00ff88)',
                color: '#0a0e27',
                fontWeight: '700',
                borderRadius: '0.5rem',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.95rem',
                transition: 'all 0.3s'
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
              + Nuevo Proyecto
            </button>
            <button
              onClick={handleLogout}
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
              Salir
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '3rem 1.5rem'
      }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
            <div style={{ display: 'inline-block', fontSize: '3rem', marginBottom: '1rem' }}>⏳</div>
            <p style={{ color: '#a0aec0', fontSize: '1.1rem' }}>Cargando proyectos...</p>
          </div>
        ) : projects.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎬</div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.5rem' }}>
              No tienes proyectos aún
            </h2>
            <p style={{ color: '#a0aec0', marginBottom: '1.5rem', fontSize: '1.1rem' }}>
              Crea tu primer video promo cinematográfico
            </p>
            <button
              onClick={() => router.push('/dashboard/new')}
              style={{
                padding: '0.75rem 2rem',
                background: 'linear-gradient(135deg, #00d4ff, #00ff88)',
                color: '#0a0e27',
                fontWeight: '700',
                borderRadius: '0.5rem',
                border: 'none',
                cursor: 'pointer',
                fontSize: '1rem',
                transition: 'all 0.3s'
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
              Crear Proyecto
            </button>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1.5rem'
          }}>
            {projects.map((project) => (
              <div
                key={project.id}
                style={{
                  padding: '1.5rem',
                  backgroundColor: hoveredProject === project.id ? 'rgba(0, 212, 255, 0.12)' : 'rgba(255, 255, 255, 0.05)',
                  border: hoveredProject === project.id ? '1px solid rgba(0, 212, 255, 0.5)' : '1px solid rgba(0, 212, 255, 0.2)',
                  borderRadius: '0.75rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  backdropFilter: 'blur(10px)'
                }}
                onClick={() => router.push(`/dashboard/${project.id}`)}
                onMouseEnter={() => setHoveredProject(project.id)}
                onMouseLeave={() => setHoveredProject(null)}
              >
                <div style={{ marginBottom: '1rem', fontSize: '2.5rem' }}>🎬</div>
                <h3 style={{
                  fontWeight: '600',
                  marginBottom: '0.5rem',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {project.title}
                </h3>
                <p style={{
                  fontSize: '0.9rem',
                  color: '#a0aec0',
                  marginBottom: '1rem',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {project.description || 'Sin descripción'}
                </p>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '0.8rem',
                  color: '#718096'
                }}>
                  <span style={{
                    display: 'inline-block',
                    padding: '0.25rem 0.75rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    borderRadius: '0.3rem',
                    textTransform: 'capitalize'
                  }}>
                    {project.style}
                  </span>
                  <span>{new Date(project.created_at).toLocaleDateString('es-ES')}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
