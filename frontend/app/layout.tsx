import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { ReduxProvider } from '@/components/ReduxProvider'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { OnboardingProvider } from '@/contexts/OnboardingContext'

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
    <html lang="en">
      <head>
        <link
          rel="preload"
          href="/hero-section.svg"
          as="image"
          type="image/svg+xml"
        />
        <link
          rel="preload"
          href="/hero-section-light.svg"
          as="image"
          type="image/svg+xml"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ReduxProvider>
          <ThemeProvider>
            <OnboardingProvider>{children}</OnboardingProvider>
          </ThemeProvider>
        </ReduxProvider>
      </body>
    </html>
  )
}
