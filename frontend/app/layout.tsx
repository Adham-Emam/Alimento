import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { ReduxProvider } from '@/components/ReduxProvider'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { OnboardingProvider } from '@/components/OnboardingProvider'
import { Toaster } from 'sonner'

import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title:
    'Alimento – Personalized Nutrition Tracking & Healthy Lifestyle Assistant',
  description:
    'Alimento is a smart nutrition app that helps users track meals, monitor daily intake, set health goals, and receive personalized recommendations based on their habits. Designed to make healthy eating simple and sustainable, Alimento offers real-time insights, progress tracking, and a smooth user experience for anyone looking to improve their overall wellness.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ReduxProvider>
          <ThemeProvider>
            <OnboardingProvider>{children}</OnboardingProvider>
          </ThemeProvider>
        </ReduxProvider>
        <Toaster position="bottom-right" />
      </body>
    </html>
  )
}
