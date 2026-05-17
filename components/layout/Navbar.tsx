'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Button from '@/components/ui/Button'
import { supabase } from '@/lib/supabase'

interface NavbarProps {
  transparent?: boolean
}

export default function Navbar({ transparent = false }: NavbarProps) {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }

    getUser()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={`sticky top-0 z-50 border-b border-white/10 backdrop-blur-xl ${
        transparent ? 'bg-transparent' : 'bg-dark/50'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={() => router.push('/')}
          className="flex items-center gap-2 text-xl font-bold"
        >
          <span className="text-2xl">🎬</span>
          <span className="bg-gradient-to-r from-neon to-cyan-400 bg-clip-text text-transparent">
            MotionAI
          </span>
        </motion.button>

        {/* Links */}
        <div className="hidden md:flex items-center gap-8">
          <a
            href="/#features"
            className="text-gray-400 hover:text-white transition-colors text-sm"
          >
            Features
          </a>
          <a
            href="/#pricing"
            className="text-gray-400 hover:text-white transition-colors text-sm"
          >
            Pricing
          </a>
          <a
            href="/#faq"
            className="text-gray-400 hover:text-white transition-colors text-sm"
          >
            FAQ
          </a>
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center gap-3">
          {loading ? (
            <div className="w-8 h-8 rounded-full bg-white/10 animate-pulse" />
          ) : user ? (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push('/dashboard')}
              >
                Dashboard
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/auth/login')}
              >
                Login
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => router.push('/auth/signup')}
              >
                Get Started
              </Button>
            </>
          )}
        </div>
      </nav>
    </motion.header>
  )
}
