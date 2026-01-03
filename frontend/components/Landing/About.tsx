'use client'
import Image from 'next/image'
import { useTheme } from '@/contexts/ThemeContext'
import JourneyImage from '@/public/about-section.svg'
import JourneyImageLight from '@/public/about-section-light.svg'
import { motion } from 'motion/react'

const About = () => {
  const { theme } = useTheme()

  return (
    <section
      id="about"
      className="container py-20 flex flex-col-reverse lg:flex-row-reverse justify-between items-center gap-4"
    >
      <motion.div
        initial={{ opacity: 0, x: 100, filter: 'blur(10px)' }}
        whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
        transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
        className="flex-1"
        style={{ willChange: 'transform, opacity, filter' }}
      >
        <h2 className="text-3xl md:text-5xl font-extrabold">
          About Our Journey to Better Health
        </h2>
        <p className="font-medium mt-1">
          We believe that eating well is the foundation of a vibrant and
          balanced life. Our mission is to make nutrition simple, accessible,
          and personalized for everyone.
        </p>
        <div className="text-muted-foreground mt-3">
          <p>
            In today’s fast-paced world, it’s easy to lose track of what we eat
            and how it affects our well-being. That’s why we created this
            platform — to empower you with knowledge, insight, and guidance to
            make healthier choices effortlessly.
            <br />
            From meal planning and nutrition tracking to practical tips and
            inspirational guidance, our approach is holistic, combining science
            with simplicity. Whether you’re looking to improve your energy,
            maintain a healthy weight, or just understand your body better,
            we’re here to guide you on every step of your journey.
          </p>
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: -100, filter: 'blur(10px)' }}
        whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
        transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
        className="flex-1"
        style={{ willChange: 'transform, opacity, filter' }}
      >
        <Image
          src={theme === 'dark' ? JourneyImageLight : JourneyImage}
          width={488}
          height={488}
          alt="Journey Image"
        />
      </motion.div>
    </section>
  )
}

export default About
