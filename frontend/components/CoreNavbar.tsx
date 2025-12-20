'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { FaAppleAlt } from 'react-icons/fa'
import { RiSunFill, RiMoonFill } from 'react-icons/ri'
import { useTheme } from '@/contexts/ThemeContext'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import Logo from '@/public/Logo.png'

const navLinks = [
  { name: 'My Plans', url: '/plans' },
  { name: 'Feeds', url: '/community' },
  { name: 'Blog', url: '/blog' },
  { name: 'Personalized Tips', url: '/ai' },
]

const CoreNavbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const { theme, toggleTheme } = useTheme()

  const toggleOpen = () => setIsOpen(!isOpen)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 w-full overflow-y-hidden duration-300 transition-all lg:h-[68px] z-50 ${
        isOpen
          ? 'h-[410px] bg-foreground/80 bg-clip-padding backdrop-filter backdrop-blur-sm text-header-foreground'
          : scrolled
          ? 'h-[68px] bg-foreground/80 bg-clip-padding backdrop-filter backdrop-blur-sm text-header-foreground'
          : 'h-[68px] bg-background text-header'
      }`}
    >
      <div className="container flex justify-between items-center relative py-4">
        <div
          className={`text-3xl font-extrabold  ${
            scrolled || isOpen ? 'text-header-foreground' : 'text-header'
          }`}
        >
          <Link href="/" className="flex items-center gap-2">
            <Image src={Logo} width={30} height={30} alt="Logo Icon" /> Aliménto
          </Link>
        </div>

        <nav className="flex-1 flex justify-center items-center gap-4">
          {navLinks.map((link, index) => {
            return (
              <div key={index} className="hidden lg:flex">
                <Link
                  href={link.url}
                  className="font-semibold duration-300 opacity-80 hover:opacity-100"
                >
                  {link.name}
                </Link>
              </div>
            )
          })}
        </nav>

        <div className="ms-auto flex  justify-between items-center gap-3">
          <Button
            size="icon"
            onClick={toggleTheme}
            variant={isOpen ? 'outline' : 'default'}
          >
            {theme === 'dark' ? <RiSunFill /> : <RiMoonFill />}
          </Button>
          <Button
            size="icon"
            className="rounded-full flex lg:hidden"
            onClick={toggleOpen}
            variant={isOpen ? 'outline' : 'default'}
          >
            <FaAppleAlt />
          </Button>
        </div>

        {/* Mobile Navigation */}

        <nav className="block lg:hidden w-full absolute top-full left-0 px-3">
          {navLinks.map((link, index) => {
            return (
              <div key={index} className="flex flex-col">
                <Link
                  href={link.url}
                  className="font-semibold duration-300 opacity-70 py-4 px-4 hover:opacity-100"
                  onClick={toggleOpen}
                >
                  {link.name}
                </Link>
                <Separator />
              </div>
            )
          })}
        </nav>
      </div>
    </header>
  )
}

export default CoreNavbar
