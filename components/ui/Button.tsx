import React from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

const variantClasses = {
  primary:
    'bg-neon text-dark hover:bg-neon/90 active:bg-neon/80 disabled:opacity-50',
  secondary:
    'bg-white/10 text-white hover:bg-white/20 active:bg-white/30 disabled:opacity-50',
  outline:
    'border border-white/20 text-white hover:border-white/40 hover:bg-white/5 disabled:opacity-50',
  ghost:
    'text-white hover:bg-white/10 active:bg-white/20 disabled:opacity-50',
}

const sizeClasses = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2.5 text-base',
  lg: 'px-6 py-3 text-lg',
}

export default function Button({
  variant = 'primary',
  size = 'md',
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'font-medium rounded-lg transition-all duration-200 disabled:cursor-not-allowed',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    />
  )
}
