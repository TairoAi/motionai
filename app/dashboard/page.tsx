'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Button from '@/components/ui/Button'
import { supabase } from '@/lib/supabase'
import type { Project } from '@/lib/types'

export default function DashboardPage() {
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          router.push('/auth/login')
          return
        }

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

  return (
    <div className="min-h-screen bg-gradient-dark">
      <header className="border-b border-white/10 backdrop-blur-xl bg-dark/50 sticky top-0 z-40">
        <div className="max-w-full mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Mis Proyectos</h1>
          <Button
            variant="primary"
            onClick={() => router.push('/dashboard/new')}
          >
            + Nuevo Proyecto
          </Button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin text-4xl mb-4">⏳</div>
            <p className="text-gray-400">Cargando proyectos...</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎬</div>
            <h2 className="text-xl font-semibold mb-2">No tienes proyectos aún</h2>
            <p className="text-gray-400 mb-6">Crea tu primer video promo</p>
            <Button
              variant="primary"
              onClick={() => router.push('/dashboard/new')}
            >
              Crear Proyecto
            </Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => router.push(`/dashboard/${project.id}`)}
                className="glassmorphism p-6 rounded-xl cursor-pointer hover:border-neon transition-all border border-white/10 hover:border-neon/50 group"
              >
                <div className="mb-4 text-4xl">🎬</div>
                <h3 className="font-semibold mb-2 line-clamp-2">{project.title}</h3>
                <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                  {project.description || 'Sin descripción'}
                </p>
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span className="inline-block px-2 py-1 bg-white/5 rounded">
                    {project.style}
                  </span>
                  <span>{new Date(project.created_at).toLocaleDateString('es-ES')}</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
