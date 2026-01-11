'use client'

import {
  createContext,
  useContext,
  useLayoutEffect,
  useState,
  ReactNode,
} from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextProps {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined)

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme | null>(null) // start as null
  const [mounted, setMounted] = useState(false)

  useLayoutEffect(() => {
    const storedTheme = localStorage.getItem('theme') as Theme | null

    let activeTheme: Theme
    if (storedTheme) {
      activeTheme = storedTheme
    } else {
      activeTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
    }

    setTheme(activeTheme)
    document.documentElement.classList.add(
      activeTheme === 'dark' ? 'dark' : 'light'
    )
    document.documentElement.classList.remove(
      activeTheme === 'dark' ? 'light' : 'dark'
    )

    setMounted(true)

    // Optional: listen to system preference changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem('theme')) {
        const newTheme = e.matches ? 'dark' : 'light'
        setTheme(newTheme)
        document.documentElement.classList.add(
          newTheme === 'dark' ? 'dark' : 'light'
        )
        document.documentElement.classList.remove(
          newTheme === 'dark' ? 'light' : 'dark'
        )
      }
    }
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  const toggleTheme = () => {
    if (!theme) return
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    document.documentElement.classList.add(
      newTheme === 'dark' ? 'dark' : 'light'
    )
    document.documentElement.classList.remove(
      newTheme === 'dark' ? 'light' : 'dark'
    )
    localStorage.setItem('theme', newTheme)
  }

  if (!mounted || theme === null) {
    // don’t render anything until we know the theme
    return null
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used within a ThemeProvider')
  return context
}
