'use client'

import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0f0f0f' }}>
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/10" style={{ background: 'rgba(15, 15, 15, 0.9)', backdropFilter: 'blur(10px)' }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold" style={{ backgroundImage: 'linear-gradient(135deg, #00ff88 0%, #00d4ff 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            🎬 MotionAI
          </div>
          <div className="flex gap-4">
            <Link href="/auth/login" className="px-6 py-2 text-sm text-gray-300 hover:text-white transition-colors">
              Sign In
            </Link>
            <Link href="/auth/signup" className="px-6 py-2 font-semibold rounded-lg transition-all" style={{ backgroundColor: '#00ff88', color: '#0f0f0f' }}>
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-40 pb-20 px-6 max-w-7xl mx-auto text-center">
        <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight text-white">
          Create Cinematic<br />
          <span style={{ backgroundImage: 'linear-gradient(135deg, #00ff88 0%, #00d4ff 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            Promo Videos with AI
          </span>
        </h1>
        <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
          Upload screenshots, describe your product, pick a style. MotionAI generates professional videos in minutes.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/dashboard" className="px-8 py-4 font-semibold rounded-lg transition-all hover:scale-105" style={{ backgroundColor: '#00ff88', color: '#0f0f0f' }}>
            Start Creating
          </Link>
          <button className="px-8 py-4 border rounded-lg transition-all text-white hover:bg-white/5" style={{ borderColor: '#00ff88' }}>
            Watch Demo
          </button>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12 text-white">Features</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: '✨', title: 'AI Generation', desc: 'Describe your product, AI generates cinematography' },
            { icon: '🎬', title: 'Real-time Preview', desc: 'See exactly how your video will look' },
            { icon: '📱', title: 'Multiple Formats', desc: 'MP4 1080p, Instagram Reels, YouTube, Square' },
            { icon: '🎨', title: '6 Pro Styles', desc: 'Apple, OpenAI, Neon, SaaS, Minimal, Cyber' },
            { icon: '⚡', title: 'Built-in Effects', desc: 'Motion blur, glow, parallax, zoom & more' },
            { icon: '🎵', title: 'Sound Design', desc: 'Professional sound effects & curated music' },
          ].map((f, i) => (
            <div key={i} className="p-6 rounded-xl border" style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)' }}>
              <div className="text-4xl mb-4">{f.icon}</div>
              <h3 className="font-semibold text-lg mb-2 text-white">{f.title}</h3>
              <p className="text-gray-400 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12 text-white">Pricing</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { name: 'Starter', price: '0', desc: 'Perfect to try', features: ['5 projects/mo', 'MP4 720p', 'Limited AI'] },
            { name: 'Pro', price: '29', desc: 'Serious creators', features: ['Unlimited projects', 'All formats', 'Priority AI', '100GB storage'] },
            { name: 'Team', price: '99', desc: 'Agencies', features: ['Everything in Pro', 'Team collab', 'API access', '1TB storage'] },
          ].map((p, i) => (
            <div key={i} className="p-8 rounded-xl border" style={{ background: 'rgba(255,255,255,0.05)', borderColor: i === 1 ? '#00ff88' : 'rgba(255,255,255,0.1)', transform: i === 1 ? 'scale(1.05)' : 'scale(1)' }}>
              <h3 className="text-2xl font-bold mb-2 text-white">{p.name}</h3>
              <p className="text-gray-400 text-sm mb-4">{p.desc}</p>
              <div className="text-4xl font-bold mb-6 text-white">${p.price}<span className="text-lg text-gray-400">/mo</span></div>
              <ul className="space-y-2 mb-6">
                {p.features.map((f, j) => <li key={j} className="text-gray-300 text-sm">✓ {f}</li>)}
              </ul>
              <button className="w-full py-2 rounded-lg font-semibold transition-all" style={{ backgroundColor: i === 1 ? '#00ff88' : 'transparent', color: i === 1 ? '#0f0f0f' : '#00ff88', border: i === 1 ? 'none' : '1px solid #00ff88' }}>
                Get Started
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 px-6 text-center text-gray-400 text-sm">
        <p>© 2026 MotionAI. All rights reserved.</p>
      </footer>
    </div>
  )
}
