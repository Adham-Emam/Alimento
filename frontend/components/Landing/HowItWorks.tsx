'use client'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useTheme } from '@/contexts/ThemeContext'
import sectionImg from '@/public/howItWorks-section.svg'
import sectionImgLight from '@/public/howItWorks-section-light.svg'

const cards = [
  {
    title: 'Start With Your Goals',
    subtitle: 'Tell us what you want to achieve.',
    description:
      'Set your intentions — more energy, balanced eating, weight control, or simply becoming more aware of your nutrition. We adapt everything around your personal path.',
  },
  {
    title: 'Track What You Eat',
    subtitle: 'Log meals effortlessly.',
    description:
      'Add your foods in seconds and get an easy-to-understand overview of calories, macros, and nutrients. No stress, no clutter — just clarity.',
  },
  {
    title: 'Receive Guidance Daily',
    subtitle: 'Get insights that gently keep you on track.',
    description:
      'Personalized tips and patterns help you choose better meals and stay aligned with your goals. Small steps, big impact.',
  },
]

const HowItWorks = () => {
  const { theme } = useTheme()

  return (
    <section id="howItWorks" className="container py-20">
      <div className="mb-24 text-center">
        <h2 className="text-3xl md:text-5xl font-extrabold">How It Works</h2>
        <p className="font-medium mt-1">
          A simple journey designed to guide you toward healthier habits — one
          step at a time.
        </p>
      </div>
      <div className="flex flex-col-reverse lg:flex-row justify-between items-center">
        <motion.div
          initial={{ opacity: 0, x: -100, filter: 'blur(10px)' }}
          whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
          transition={{
            duration: 1,
            delay: 0.1,
            ease: 'anticipate',
          }}
          className="flex-1"
          style={{ willChange: 'transform, opacity, filter' }}
        >
          <Image
            src={theme === 'light' ? sectionImg : sectionImgLight}
            width={488}
            height={488}
            alt=""
          />
        </motion.div>
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 auto-rows-auto">
          {cards.map((card, index) => {
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 100, filter: 'blur(10px)' }}
                whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                transition={{
                  duration: 1,
                  delay: 0.1 * (index % 2),
                  ease: 'anticipate',
                }}
                className="bg-card border border-ring py-5 px-3 rounded-xl justify-self-end"
                style={{ willChange: 'transform, opacity, filter' }}
              >
                <span className="text-3xl md:text-5xl font-extrabold text-accent-foreground bg-accent rounded-full w-16 h-16 flex items-center justify-center mb-8">
                  {index + 1}
                </span>
                <h3 className="text-lg lg:text-2xl font-bold">{card.title}</h3>
                <p className="font-medium">{card.subtitle}</p>
                <p className="text-muted-foreground mt-4">{card.description}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
