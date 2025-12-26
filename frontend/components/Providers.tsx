'use client'

import { AuthProvider } from '@/contexts/AuthContext'
import { OnboardingProvider } from '@/contexts/OnboardingContext'
import { ThemeProvider } from '@/contexts/ThemeContext'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <OnboardingProvider>
        <ThemeProvider>{children}</ThemeProvider>
      </OnboardingProvider>
    </AuthProvider>
  )
}
