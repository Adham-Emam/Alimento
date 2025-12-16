import Image from 'next/image'
import Link from 'next/link'
import SubscribeForm from '@/components/Landing/SubscribeForm'
import { Separator } from '../ui/separator'
import { FaYoutube, FaInstagram } from 'react-icons/fa'
import { FaXTwitter } from 'react-icons/fa6'
import Logo from '@/public/Logo.png'

interface QuickLinksProps {
  name: string
  url: string
}

const quickLinks: QuickLinksProps[] = [
  { name: 'Home', url: '/' },
  { name: 'About', url: '/#about' },
  { name: 'Features', url: '/#features' },
  { name: 'How it Works', url: '/#howItWorks' },
  { name: 'Why Nutrition Matters', url: '/#whyNutrition' },
  { name: 'Our Vision', url: '/#vision' },
]

const Footer = () => {
  return (
    <footer className="bg-card text-card-foreground border-t border-border mt-20">
      <div className="container mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div>
          <h3 className="text-2xl font-semibold text-header mb-3 flex items-center gap-2">
            <Image src={Logo} width={30} height={30} alt="Logo" /> Aliménto
          </h3>
          <p className="text-sm leading-relaxed max-w-xs">
            Nourish your habits. Understand your food. A simpler way to build a
            healthier you — one small choice at a time.
          </p>
        </div>

        <div>
          <h4 className="text-lg font-medium mb-3 text-header">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            {quickLinks.map((link, index) => {
              return (
                <li key={index} className="hover:text-header duration-300">
                  <Link href={link.url}>{link.name}</Link>
                </li>
              )
            })}
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-medium mb-3 text-header">Resources</h4>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-header duration-300 cursor-pointer">
              Blog
            </li>
            <li className="hover:text-header duration-300 cursor-pointer">
              FAQs
            </li>
            <li className="hover:text-header duration-300 cursor-pointer">
              Contact
            </li>
            <li className="hover:text-header duration-300 cursor-pointer">
              Privacy Policy
            </li>
            <li className="hover:text-header duration-300 cursor-pointer">
              Terms of Service
            </li>
          </ul>
        </div>

        {/* Socials */}
        <div>
          <h4 className="text-lg font-medium mb-3 text-header">Follow Us</h4>
          <div className="flex items-center gap-4 text-2xl ">
            <span className="hover:text-header duration-300 cursor-pointer">
              <FaYoutube />
            </span>
            <span className="hover:text-header duration-300 cursor-pointer">
              <FaXTwitter />
            </span>
            <span className="hover:text-header duration-300 cursor-pointer">
              <FaInstagram />
            </span>
          </div>
          <div className="w-full mt-5">
            <h4 className="text-lg font-medium mb-2 text-header">
              Subscribe to get the latest news
            </h4>
            <SubscribeForm />
          </div>
        </div>
      </div>

      <Separator className="bg-card-foreground/10" />

      <div className="py-5 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} <strong>Aliménto</strong>. All rights
        reserved.
      </div>
    </footer>
  )
}

export default Footer
