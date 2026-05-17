'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Navbar from '../components/layout/Navbar'
import Button from '../components/ui/Button'

const FEATURES = [
  {
    icon: '✨',
    title: 'IA Generadora',
    description: 'GPT-4o entiende tu descripción y genera escenas cinematográficas automáticamente',
  },
  {
    icon: '🎬',
    title: 'Preview en Tiempo Real',
    description: 'Ve exactamente cómo se verá tu video antes de exportar',
  },
  {
    icon: '📱',
    title: 'Múltiples Formatos',
    description: 'Exporta en MP4 1080p, Instagram Reels, YouTube 2K, o Square',
  },
  {
    icon: '🎨',
    title: '6 Estilos Profesionales',
    description: 'Apple, OpenAI, Neon, SaaS, Minimal, Cyber - elige el que matches tu brand',
  },
  {
    icon: '⚡',
    title: 'Efectos Incluidos',
    description: 'Motion blur, glow, parallax, zoom y más - todo integrado',
  },
  {
    icon: '🎵',
    title: 'Diseño de Sonido',
    description: 'Efectos de sonido profesionales y música de fondo curada',
  },
]

const PRICING = [
  {
    name: 'Starter',
    price: '0',
    description: 'Perfecto para probar',
    features: ['5 proyectos/mes', 'Exportar MP4 720p', 'Uso de IA limitado', 'Almacenamiento 2GB'],
    cta: 'Empezar Gratis',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '29',
    description: 'Para creadores serios',
    features: [
      'Proyectos ilimitados',
      'Exportar todos los formatos',
      'IA generadora prioritaria',
      'Almacenamiento 100GB',
      'Soporte email',
    ],
    cta: 'Comenzar Prueba',
    highlighted: true,
  },
  {
    name: 'Team',
    price: '99',
    description: 'Para equipos y agencias',
    features: [
      'Todo en Pro +',
      'Colaboración en equipo',
      'Permisos y roles',
      'Almacenamiento 1TB',
      'API access',
      'Soporte prioritario',
    ],
    cta: 'Contactar Ventas',
    highlighted: false,
  },
]

const FAQS = [
  {
    q: '¿Cuánto tarda exportar un video?',
    a: 'Depende del formato: MP4 1080p tarda 2-3 minutos, Instagram Reels 1-2 minutos, YouTube 2K 4-5 minutos.',
  },
  {
    q: '¿Puedo editar las escenas después de generarlas?',
    a: 'Sí, completamente. Edita duración, texto, efectos, y reordena escenas en el timeline visual.',
  },
  {
    q: '¿Qué formatos de media puedo subir?',
    a: 'PNG, JPG, MP4 y WebM. Máximo 100MB por archivo.',
  },
  {
    q: '¿Mis videos son privados?',
    a: 'Completamente privados. Solo tú tienes acceso a tus proyectos y exportaciones.',
  },
  {
    q: '¿Puedo descargar mis videos?',
    a: 'Sí, descarga directamente desde tu dashboard o comparte links públicos.',
  },
]

export default function HomePage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-dark">
      <Navbar transparent />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-neon/20 via-transparent to-cyan-500/20 blur-3xl" />
        </div>

        <div className="relative max-w-6xl mx-auto px-6 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6 mb-12"
          >
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              Crea Videos Promo{' '}
              <span className="bg-gradient-to-r from-neon via-cyan-400 to-neon bg-clip-text text-transparent">
                Cinematográficos con IA
              </span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Sube screenshots, describe tu producto, elige un estilo. MotionAI genera un video promo
              profesional que rivaliza con Apple y OpenAI - en minutos, no en días.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
          >
            <Button
              variant="primary"
              size="lg"
              onClick={() => router.push('/auth/signup')}
            >
              🚀 Comenzar Gratis
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => {
                const el = document.getElementById('features')
                el?.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              Ver Features
            </Button>
          </motion.div>

          {/* Demo Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="grid md:grid-cols-3 gap-8 max-w-2xl mx-auto"
          >
            <div className="space-y-2">
              <p className="text-3xl font-bold text-neon">{`< 5 min`}</p>
              <p className="text-gray-400 text-sm">Crear video completo</p>
            </div>
            <div className="space-y-2">
              <p className="text-3xl font-bold text-neon">4K</p>
              <p className="text-gray-400 text-sm">Máxima calidad exportable</p>
            </div>
            <div className="space-y-2">
              <p className="text-3xl font-bold text-neon">∞</p>
              <p className="text-gray-400 text-sm">Proyectos en Pro</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-4xl font-bold text-center mb-16"
          >
            Potencia Cinematográfica al Alcance
          </motion.h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glassmorphism p-6 rounded-xl border border-white/10 hover:border-neon/50 transition-all"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-6 bg-white/5">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-4xl font-bold text-center mb-16"
          >
            Planes Simples y Claros
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-8">
            {PRICING.map((plan, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`rounded-xl border transition-all ${
                  plan.highlighted
                    ? 'glassmorphism border-neon bg-neon/10 scale-105 md:scale-110'
                    : 'glassmorphism border-white/10 hover:border-white/20'
                }`}
              >
                <div className="p-8 space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                    <p className="text-gray-400 text-sm">{plan.description}</p>
                  </div>

                  <div className="space-y-1">
                    <div className="text-4xl font-bold">
                      ${plan.price}
                      <span className="text-lg text-gray-400">/mes</span>
                    </div>
                  </div>

                  <ul className="space-y-3">
                    {plan.features.map((feature, j) => (
                      <li key={j} className="flex items-center gap-2 text-sm">
                        <span className="text-neon">✓</span>
                        <span className="text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    variant={plan.highlighted ? 'primary' : 'outline'}
                    className="w-full"
                    onClick={() => router.push('/auth/signup')}
                  >
                    {plan.cta}
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-4xl font-bold text-center mb-16"
          >
            Preguntas Frecuentes
          </motion.h2>

          <div className="space-y-4">
            {FAQS.map((faq, i) => (
              <motion.details
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                className="glassmorphism p-6 rounded-xl border border-white/10 cursor-pointer group"
              >
                <summary className="flex items-center justify-between font-semibold">
                  <span>{faq.q}</span>
                  <span className="group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="text-gray-400 text-sm mt-4">{faq.a}</p>
              </motion.details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="py-20 px-6 bg-gradient-to-r from-neon/20 to-cyan-500/20">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-4xl font-bold"
          >
            ¿Listo para Crear Videos Cinematográficos?
          </motion.h2>
          <p className="text-xl text-gray-400">
            Únete a startups y creadores que usan MotionAI para generar promos profesionales
          </p>
          <Button
            variant="primary"
            size="lg"
            onClick={() => router.push('/auth/signup')}
          >
            Empezar Ahora - Es Gratis 🚀
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between text-sm text-gray-400">
          <p>© 2026 MotionAI. Todos los derechos reservados.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">
              Privacidad
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Términos
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Contacto
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
