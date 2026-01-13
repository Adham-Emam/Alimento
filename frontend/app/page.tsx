import dynamic from 'next/dynamic'
import LandingNavbar from '@/components/Landing/LandingNavbar'
import Hero from '@/components/Landing/Hero'
import Footer from '@/components/Landing/Footer'

export const metadata = {
  additionalLinkTags: [
    {
      rel: 'preload',
      href: '/hero-section.svg',
      as: 'image',
      type: 'image/svg+xml',
    },
    {
      rel: 'preload',
      href: '/hero-section-light.svg',
      as: 'image',
      type: 'image/svg+xml',
    },
  ],
}

const About = dynamic(() => import('@/components/Landing/About'))
const Features = dynamic(() => import('@/components/Landing/Features'))
const HowItWorks = dynamic(() => import('@/components/Landing/HowItWorks'))
const WhyNutrition = dynamic(() => import('@/components/Landing/WhyNutrition'))
const Vision = dynamic(() => import('@/components/Landing/Vision'))

export default function Home() {
  return (
    <>
      <LandingNavbar />
      <main className="overflow-x-hidden">
        <Hero />
        <About />
        <Features />
        <HowItWorks />
        <WhyNutrition />
        <Vision />
      </main>
      <Footer />
    </>
  )
}
