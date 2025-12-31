import dynamic from 'next/dynamic'
import LandingNavbar from '@/components/Landing/LandingNavbar'
import Hero from '@/components/Landing/Hero'
import Footer from '@/components/Landing/Footer'

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
