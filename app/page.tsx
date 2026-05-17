'use client'

import Link from 'next/link'

export default function Home() {
  return (
    <div style={{ backgroundColor: '#0a0e27', color: '#ffffff', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Navigation */}
      <nav style={{ position: 'fixed', top: 0, width: '100%', zIndex: 50, background: 'linear-gradient(180deg, rgba(10,14,39,0.9) 0%, rgba(10,14,39,0))', padding: '1.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: '28px', fontWeight: 'bold', background: 'linear-gradient(135deg, #00d4ff, #00ff88)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          ✨ MotionAI
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link href="/auth/login" style={{ padding: '0.75rem 1.5rem', color: '#a0aec0', textDecoration: 'none', transition: 'all 0.3s' }} onMouseEnter={(e) => e.target.style.color = '#00d4ff'} onMouseLeave={(e) => e.target.style.color = '#a0aec0'}>
            Sign In
          </Link>
          <Link href="/auth/signup" style={{ padding: '0.75rem 1.5rem', background: 'linear-gradient(135deg, #00d4ff, #00ff88)', color: '#0a0e27', borderRadius: '0.75rem', fontWeight: '600', textDecoration: 'none', cursor: 'pointer', transition: 'all 0.3s', boxShadow: '0 10px 30px rgba(0, 212, 255, 0.3)' }} onMouseEnter={(e) => e.target.style.boxShadow = '0 15px 40px rgba(0, 212, 255, 0.5)'} onMouseLeave={(e) => e.target.style.boxShadow = '0 10px 30px rgba(0, 212, 255, 0.3)'}>
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem 2rem', textAlign: 'center', background: 'radial-gradient(ellipse at center, rgba(0,212,255,0.1) 0%, rgba(10,14,39,1) 70%)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ maxWidth: '900px', zIndex: 2 }}>
          <h1 style={{ fontSize: 'clamp(2.5rem, 10vw, 4.5rem)', fontWeight: '800', marginBottom: '1.5rem', lineHeight: '1.2', background: 'linear-gradient(135deg, #ffffff 0%, #00d4ff 50%, #00ff88 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Crea Videos Promo<br />Cinematográficos con IA
          </h1>
          <p style={{ fontSize: '1.25rem', color: '#cbd5e0', marginBottom: '2.5rem', lineHeight: '1.6' }}>
            Sube screenshots, describe tu producto, elige un estilo.<br />MotionAI genera videos profesionales que compiten con Apple y OpenAI — en minutos.
          </p>
          <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/dashboard" style={{ padding: '1rem 2rem', background: 'linear-gradient(135deg, #00d4ff, #00ff88)', color: '#0a0e27', borderRadius: '0.75rem', fontWeight: '700', textDecoration: 'none', fontSize: '1.1rem', cursor: 'pointer', transition: 'all 0.3s', boxShadow: '0 20px 40px rgba(0, 212, 255, 0.4)' }} onMouseEnter={(e) => { e.target.style.transform = 'translateY(-5px)'; e.target.style.boxShadow = '0 30px 50px rgba(0, 212, 255, 0.6)'; }} onMouseLeave={(e) => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 20px 40px rgba(0, 212, 255, 0.4)'; }}>
              🚀 Comenzar Gratis
            </Link>
            <button style={{ padding: '1rem 2rem', background: 'transparent', border: '2px solid #00d4ff', color: '#00d4ff', borderRadius: '0.75rem', fontWeight: '700', textDecoration: 'none', fontSize: '1.1rem', cursor: 'pointer', transition: 'all 0.3s' }} onMouseEnter={(e) => { e.target.style.background = 'rgba(0, 212, 255, 0.1)'; e.target.style.boxShadow = '0 0 20px rgba(0, 212, 255, 0.3)'; }} onMouseLeave={(e) => { e.target.style.background = 'transparent'; e.target.style.boxShadow = 'none'; }}>
              Ver Demo
            </button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ padding: '4rem 2rem', maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', textAlign: 'center' }}>
        {[
          { number: '< 5 min', label: 'Crear video completo' },
          { number: '4K', label: 'Máxima calidad' },
          { number: '∞', label: 'Proyectos ilimitados' },
        ].map((stat, i) => (
          <div key={i}>
            <div style={{ fontSize: '3rem', fontWeight: '800', background: 'linear-gradient(135deg, #00d4ff, #00ff88)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '0.5rem' }}>{stat.number}</div>
            <div style={{ color: '#a0aec0' }}>{stat.label}</div>
          </div>
        ))}
      </section>

      {/* Features */}
      <section style={{ padding: '6rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '3rem', fontWeight: '800', textAlign: 'center', marginBottom: '4rem', background: 'linear-gradient(135deg, #ffffff 0%, #00d4ff 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Funciones Poderosas
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          {[
            { icon: '✨', title: 'IA Generadora', desc: 'GPT-4o entiende tu descripción y genera escenas cinematográficas automáticamente' },
            { icon: '🎬', title: 'Preview en Tiempo Real', desc: 'Ve exactamente cómo se verá tu video antes de exportar' },
            { icon: '📱', title: 'Múltiples Formatos', desc: 'MP4 1080p, Instagram Reels, YouTube 2K, Square y más' },
            { icon: '🎨', title: '6 Estilos Profesionales', desc: 'Apple, OpenAI, Neon, SaaS, Minimal, Cyber — elige tu estilo' },
            { icon: '⚡', title: 'Efectos Premium', desc: 'Motion blur, glow, parallax, zoom — todo integrado' },
            { icon: '🎵', title: 'Sonido Profesional', desc: 'Efectos de sonido y música de fondo curada' },
          ].map((f, i) => (
            <div key={i} style={{ padding: '2.5rem', background: 'linear-gradient(135deg, rgba(0,212,255,0.1) 0%, rgba(0,255,136,0.05) 100%)', border: '1px solid rgba(0,212,255,0.2)', borderRadius: '1rem', transition: 'all 0.3s', cursor: 'pointer' }} onMouseEnter={(e) => { e.currentTarget.style.background = 'linear-gradient(135deg, rgba(0,212,255,0.2) 0%, rgba(0,255,136,0.1) 100%)'; e.currentTarget.style.borderColor = 'rgba(0,212,255,0.5)'; e.currentTarget.style.transform = 'translateY(-10px)'; }} onMouseLeave={(e) => { e.currentTarget.style.background = 'linear-gradient(135deg, rgba(0,212,255,0.1) 0%, rgba(0,255,136,0.05) 100%)'; e.currentTarget.style.borderColor = 'rgba(0,212,255,0.2)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{f.icon}</div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '0.75rem' }}>{f.title}</h3>
              <p style={{ color: '#cbd5e0', lineHeight: '1.6' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section style={{ padding: '6rem 2rem', background: 'linear-gradient(135deg, rgba(0,212,255,0.05) 0%, rgba(0,255,136,0.05) 100%)', maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '3rem', fontWeight: '800', textAlign: 'center', marginBottom: '4rem', background: 'linear-gradient(135deg, #ffffff 0%, #00d4ff 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Planes Simples y Claros
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
          {[
            { name: 'Starter', price: '0', features: ['5 proyectos/mes', 'MP4 720p', 'IA limitado', '2GB almacenamiento'] },
            { name: 'Pro', price: '29', highlighted: true, features: ['Proyectos ilimitados', 'Todos los formatos', 'IA prioritaria', '100GB almacenamiento', 'Soporte email'] },
            { name: 'Team', price: '99', features: ['Todo en Pro +', 'Colaboración en equipo', 'Roles y permisos', '1TB almacenamiento', 'API access'] },
          ].map((p, i) => (
            <div key={i} style={{ padding: '2.5rem', background: p.highlighted ? 'linear-gradient(135deg, rgba(0,212,255,0.15) 0%, rgba(0,255,136,0.1) 100%)' : 'rgba(255,255,255,0.05)', border: p.highlighted ? '2px solid #00d4ff' : '1px solid rgba(255,255,255,0.1)', borderRadius: '1rem', transform: p.highlighted ? 'scale(1.05)' : 'scale(1)', transition: 'all 0.3s' }} onMouseEnter={(e) => { if (!p.highlighted) { e.currentTarget.style.borderColor = 'rgba(0,212,255,0.5)'; e.currentTarget.style.background = 'rgba(0,212,255,0.1)'; } }} onMouseLeave={(e) => { if (!p.highlighted) { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; } }}>
              <h3 style={{ fontSize: '1.8rem', fontWeight: '700', marginBottom: '1rem' }}>{p.name}</h3>
              <div style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '1.5rem', background: 'linear-gradient(135deg, #00d4ff, #00ff88)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                ${p.price}<span style={{ fontSize: '1rem', color: '#a0aec0' }}>/mes</span>
              </div>
              <ul style={{ marginBottom: '2rem', textAlign: 'left' }}>
                {p.features.map((f, j) => (
                  <li key={j} style={{ padding: '0.5rem 0', color: '#cbd5e0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <span style={{ color: '#00ff88', marginRight: '0.75rem' }}>✓</span> {f}
                  </li>
                ))}
              </ul>
              <button style={{ width: '100%', padding: '1rem', background: p.highlighted ? 'linear-gradient(135deg, #00d4ff, #00ff88)' : 'transparent', color: p.highlighted ? '#0a0e27' : '#00d4ff', border: p.highlighted ? 'none' : '2px solid #00d4ff', borderRadius: '0.75rem', fontWeight: '700', cursor: 'pointer', transition: 'all 0.3s', fontSize: '1.1rem' }} onMouseEnter={(e) => { e.target.style.transform = 'translateY(-3px)'; e.target.style.boxShadow = '0 10px 30px rgba(0, 212, 255, 0.3)'; }} onMouseLeave={(e) => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = 'none'; }}>
                Empezar
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '6rem 2rem', textAlign: 'center', background: 'linear-gradient(135deg, rgba(0,212,255,0.1) 0%, rgba(0,255,136,0.1) 100%)' }}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '1.5rem', background: 'linear-gradient(135deg, #ffffff 0%, #00d4ff 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          ¿Listo para Crear Videos Increíbles?
        </h2>
        <p style={{ fontSize: '1.25rem', color: '#cbd5e0', marginBottom: '2.5rem', maxWidth: '600px', margin: '0 auto 2.5rem' }}>
          Únete a startups y creadores que generan videos profesionales con MotionAI
        </p>
        <Link href="/dashboard" style={{ display: 'inline-block', padding: '1.25rem 2.5rem', background: 'linear-gradient(135deg, #00d4ff, #00ff88)', color: '#0a0e27', borderRadius: '0.75rem', fontWeight: '700', textDecoration: 'none', fontSize: '1.2rem', cursor: 'pointer', transition: 'all 0.3s', boxShadow: '0 20px 40px rgba(0, 212, 255, 0.4)' }} onMouseEnter={(e) => { e.target.style.transform = 'translateY(-5px)'; e.target.style.boxShadow = '0 30px 50px rgba(0, 212, 255, 0.6)'; }} onMouseLeave={(e) => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 20px 40px rgba(0, 212, 255, 0.4)'; }}>
          Empezar Ahora — Es Gratis 🚀
        </Link>
      </section>

      {/* Footer */}
      <footer style={{ padding: '3rem 2rem', textAlign: 'center', color: '#718096', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <p>© 2026 MotionAI. Todos los derechos reservados.</p>
        <div style={{ marginTop: '1.5rem', display: 'flex', gap: '2rem', justifyContent: 'center', fontSize: '0.9rem' }}>
          <a href="#" style={{ color: '#718096', textDecoration: 'none' }}>Privacidad</a>
          <a href="#" style={{ color: '#718096', textDecoration: 'none' }}>Términos</a>
          <a href="#" style={{ color: '#718096', textDecoration: 'none' }}>Contacto</a>
        </div>
      </footer>
    </div>
  )
}
