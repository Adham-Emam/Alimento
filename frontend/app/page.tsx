import LandingNavbar from '@/components/Landing/LandingNavbar'
import Hero from '@/components/Landing/Hero'
import About from '@/components/Landing/About'
import Features from '@/components/Landing/Features'
import HowItWorks from '@/components/Landing/HowItWorks'
import WhyNutrition from '@/components/Landing/WhyNutrition'
import Vision from '@/components/Landing/Vision'
import Footer from '@/components/Landing/Footer'

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
