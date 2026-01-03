'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTheme } from '@/contexts/ThemeContext'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { FaAppleAlt } from 'react-icons/fa'
import { RiSunFill, RiMoonFill } from 'react-icons/ri'
import { IoIosHome } from 'react-icons/io'
import { FaNewspaper, FaBook, FaUser } from 'react-icons/fa'
import { MdEmojiFoodBeverage } from 'react-icons/md'
import { FiLogOut } from 'react-icons/fi'
import Logo from '@/public/Logo.png'

const navLinks = [
  { icon: <IoIosHome />, name: 'Dashboard', url: '/dashboard' },
  { icon: <MdEmojiFoodBeverage />, name: 'Meal Plans', url: '/meal-plans' },
  { icon: <FaBook />, name: 'Recipes', url: '/recipes' },
  { icon: <FaNewspaper />, name: 'Blog', url: '/blog' },
  { icon: <FaUser />, name: 'Profile', url: '/profile' },
]

const CoreNavbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { theme, toggleTheme } = useTheme()

  const toggleOpen = () => setIsOpen(!isOpen)

  const pathname = usePathname()

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => {
      setScrolled(window.scrollY > 100)
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // Set initial state
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Prevent hydration mismatch by using consistent server/client rendering
  const navbarClasses = `fixed top-0 left-0 w-full overflow-y-hidden duration-300 transition-all lg:h-[85px] z-50 ${
    isOpen
      ? 'h-[450px] bg-foreground/80 bg-clip-padding backdrop-filter backdrop-blur-sm text-header-foreground'
      : scrolled && mounted
      ? 'h-[85px] bg-foreground/80 bg-clip-padding backdrop-filter backdrop-blur-sm text-header-foreground'
      : 'h-[85px] bg-background text-header'
  }`

  return (
    <header className={navbarClasses}>
      <div
        className={`container flex justify-between items-center relative py-4 text-md  font-extrabold  ${
          (scrolled && mounted) || isOpen
            ? 'text-header-foreground'
            : 'text-header'
        }`}
      >
        <div
          className={`text-3xl font-extrabold  ${
            scrolled || isOpen ? 'text-header-foreground' : 'text-header'
          }`}
        >
          <Link href="/" className="flex items-center gap-2">
            <Image src={Logo} width={30} height={30} alt="Logo Icon" /> Aliménto
          </Link>
        </div>

        <nav className="flex-1 flex justify-center items-center gap-2">
          {navLinks.map((link, index) => {
            return (
              <Link
                key={index}
                href={link.url}
                className={`font-semibold duration-300 opacity-80 hover:bg-foreground/20 hidden lg:flex items-center gap-2 py-2 px-4 rounded-2xl dark:text-white ${
                  pathname === link.url && 'bg-foreground/50 text-white'
                }`}
              >
                {link.icon}
                {link.name}
              </Link>
            )
          })}
        </nav>

        <div className="ms-auto flex  justify-between items-center gap-3">
          <Button
            size="icon"
            aria-label="Dark Mode"
            onClick={toggleTheme}
            variant={isOpen ? 'outline' : 'default'}
          >
            {theme === 'dark' ? <RiSunFill /> : <RiMoonFill />}
          </Button>
          <Button
            size="icon"
            aria-label="Logout"
            variant={isOpen ? 'outline' : 'default'}
            asChild
          >
            <Link href={'/logout'}>
              <FiLogOut />
            </Link>
          </Button>
          <Button
            size="icon"
            className="rounded-full flex lg:hidden"
            aria-label="Menu"
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
