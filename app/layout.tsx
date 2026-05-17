import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'MotionAI - Crea Videos Promo Cinematográficos con IA',
  description: 'Transforma tus screenshots en videos promo profesionales cinematográficos con IA. En minutos, no en días.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className="bg-dark text-white">
        {children}
      </body>
    </html>
  )
}
