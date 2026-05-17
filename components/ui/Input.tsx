import React from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export default function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        'w-full px-4 py-2.5 bg-dark-secondary border border-white/10 rounded-lg text-white placeholder:text-gray-500',
        'focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon transition-all',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        className
      )}
      {...props}
    />
  )
}
