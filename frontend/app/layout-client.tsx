'use client'

import React from 'react'
import { AuthProvider } from './lib/auth-context'
import { ThemeProvider } from './lib/theme-context'

export default function RootLayoutClient({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ThemeProvider>
      <AuthProvider>
        {children}
      </AuthProvider>
    </ThemeProvider>
  )
}
