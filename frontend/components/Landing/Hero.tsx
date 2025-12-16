'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'motion/react'
import HeroImgLight from '@/public/hero-section-light.svg'
import HeroImg from '@/public/hero-section.svg'
import { Typewriter } from 'react-simple-typewriter'
import { useTheme } from '@/contexts/ThemeContext'
import { Button } from '@/components/ui/button'

const wordList = ['Nutrition', 'Wellness', 'Vitality', 'Balance', 'Lifestyle']

const Hero = () => {
  const { theme } = useTheme()

  return (
    <section className="container flex justify-between items-center h-screen">
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
        className="flex-1 text-center md:text-left"
      >
        <h1 className="text-3xl md:text-5xl font-extrabold">
          Your Path to Better <Typewriter words={wordList} loop cursor />
        </h1>
        <p className="mt-4 mb-5 text-sm md:text-lg text-muted-foreground">
          Embark on a journey where every bite nourishes your body and fuels
          your mind. Discover the art of mindful eating, where wholesome meals
          meet your unique rhythm, and every choice you make brings you closer
          to vitality, energy, and balance. Let your habits bloom, your wellness
          thrive, and your life transform — one meal, one moment, one step at a
          time.
        </p>
        <Button asChild>
          <Link href="/register">Learn More</Link>
        </Button>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: -100 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
        className="flex-1 hidden md:flex justify-end items-center"
      >
        <Image
          src={theme === 'light' ? HeroImg : HeroImgLight}
          width={488}
          height={488}
          loading="eager"
          alt="Hero Image"
        />
      </motion.div>
    </section>
  )
}

export default Hero
