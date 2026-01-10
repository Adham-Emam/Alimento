'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useTheme } from '@/contexts/ThemeContext'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { useAppDispatch } from '@/redux/hooks'
import { logout } from '@/redux/slices/authSlice'
import { FaAppleAlt } from 'react-icons/fa'
import { RiSunFill, RiMoonFill } from 'react-icons/ri'
import { IoIosHome } from 'react-icons/io'
import { FaNewspaper, FaBook, FaUser } from 'react-icons/fa'
import { FaBasketShopping, FaBowlFood } from 'react-icons/fa6'
import { FiLogOut } from 'react-icons/fi'
import Logo from '@/public/Logo.png'

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'

const navLinks = [
  { icon: <IoIosHome />, name: 'Dashboard', url: '/dashboard' },
  { icon: <FaBowlFood />, name: 'Feeds', url: '/feeds' },
  {
    icon: <FaBook />,
    name: 'Kitchen',
    url: '',
    content: [
      {
        title: 'Food Items',
        description:
          'Individual raw ingredients such as eggs, cheese, fish, vegetables, and dairy used as building blocks for recipes.',
        url: '/food/items',
      },
      {
        title: 'Recipes',
        description:
          'Prepared dishes made from multiple food items, like omelettes, sandwiches, salads, and fried chicken.',
        url: '/food/recipes',
      },
      {
        title: 'Meals',
        description:
          'Complete meals combining recipes and food items together, such as an omelette served with bread and a glass of milk.',
        url: '/food/meals',
      },
    ],
  },
  {
    icon: <FaBasketShopping />,
    name: 'Marketplace',
    url: '/marketplace',
  },
  { icon: <FaNewspaper />, name: 'Blog', url: '/blog' },
  { icon: <FaUser />, name: 'Profile', url: '/profile' },
]

const CoreNavbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [expanded, setExpanded] = useState<string | null>(null)
  const { theme, toggleTheme } = useTheme()

  const toggleOpen = () => setIsOpen(!isOpen)

  const router = useRouter()
  const pathname = usePathname()

  const dispatch = useAppDispatch()

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => {
      setScrolled(window.scrollY > 100)
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // Set initial state
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navbarClasses = `fixed top-0 left-0 w-full  duration-300 transition-all lg:h-[85px] z-50 ${
    isOpen
      ? 'h-[475px] bg-foreground/80 bg-clip-padding backdrop-filter backdrop-blur-sm text-header-foreground'
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
            : 'text-red'
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

        <NavigationMenu className="hidden lg:flex" viewport={false}>
          <NavigationMenuList className=" gap-2">
            {navLinks.map((link) => (
              <NavigationMenuItem key={link.name}>
                {link.content ? (
                  <>
                    <NavigationMenuTrigger
                      className={`flex flex-row items-center gap-2 px-4 py-2
                      ${pathname.startsWith('/food') ? 'bg-primary/80' : ''}
                      `}
                    >
                      {link.icon}
                      {link.name}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[300px] gap-4">
                        {link.content.map((item) => (
                          <li key={item.url}>
                            <NavigationMenuLink
                              asChild
                              className={`${
                                item.url.includes(pathname)
                                  ? 'bg-primary/80'
                                  : 'bg-transparent'
                              }`}
                            >
                              <Link href={item.url}>
                                <h4 className="font-bold text-medium">
                                  {item.title}
                                </h4>
                                <div className="text-muted-foreground font-medium text-sm">
                                  {item.description}
                                </div>
                              </Link>
                            </NavigationMenuLink>
                          </li>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </>
                ) : (
                  <NavigationMenuLink
                    asChild
                    className={navigationMenuTriggerStyle()}
                  >
                    <Link
                      href={link.url}
                      className={`flex flex-row items-center gap-2 px-4 py-2 rounded-2xl
                      ${
                        pathname === link.url
                          ? 'bg-foreground/50 text-white'
                          : ''
                      }
                      `}
                    >
                      <span className="flex items-center justify-center w-4 h-4">
                        {link.icon}
                      </span>
                      <span>{link.name}</span>
                    </Link>
                  </NavigationMenuLink>
                )}
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
        <div className="flex justify-between items-center gap-3">
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
            onClick={() => dispatch(logout())}
          >
            <FiLogOut />
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

        <nav
          className={`block lg:hidden w-full absolute top-full left-0 px-3 ${
            isOpen ? 'block' : 'hidden'
          }`}
        >
          {navLinks.map((link, index) => {
            return (
              <div key={index} className="flex flex-col">
                {link.content ? (
                  <>
                    <button
                      onClick={() =>
                        setExpanded(expanded === link.name ? null : link.name)
                      }
                      className="font-semibold duration-300 opacity-70 py-4 px-4 hover:opacity-100 text-left flex justify-between items-center"
                    >
                      {link.name}
                      <span
                        className={`transition-transform ${
                          expanded === link.name ? 'rotate-180' : ''
                        }`}
                      >
                        ▼
                      </span>
                    </button>
                    {expanded === link.name && (
                      <div className="ml-4">
                        {link.content.map((item) => (
                          <Link
                            key={item.url}
                            href={item.url}
                            className="block font-medium opacity-70 py-2 px-4 hover:opacity-100"
                            onClick={toggleOpen}
                          >
                            {item.title}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={link.url}
                    className="font-semibold duration-300 opacity-70 py-4 px-4 hover:opacity-100"
                    onClick={toggleOpen}
                  >
                    {link.name}
                  </Link>
                )}
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
