import React from 'react'
import { cn } from '@/lib/utils'

interface CardProps {
  children: React.ReactNode
  className?: string
}

export function Card({ children, className }: CardProps) {
  return (
    <div
      className={cn(
        'glassmorphism rounded-xl border border-white/10 overflow-hidden',
        className
      )}
    >
      {children}
    </div>
  )
}

export function CardHeader({ children, className }: CardProps) {
  return <div className={cn('p-6 border-b border-white/10', className)}>{children}</div>
}

export function CardContent({ children, className }: CardProps) {
  return <div className={cn('p-6', className)}>{children}</div>
}

export function CardFooter({ children, className }: CardProps) {
  return <div className={cn('p-6 border-t border-white/10', className)}>{children}</div>
}
