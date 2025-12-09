'use client'

import { FiZap, FiHeart, FiClock, FiSmile } from 'react-icons/fi'
import { motion } from 'motion/react'
import React from 'react'

interface HighlightProps {
  icon: React.ReactNode
  title: string
  description: string
}

const highlights: HighlightProps[] = [
  {
    icon: <FiZap />,
    title: 'Energy & Focus',
    description:
      'Proper nutrition fuels your body and mind for optimal performance.',
  },
  {
    icon: <FiHeart />,
    title: 'Immune Health',
    description: 'Balanced eating supports your immune system naturally.',
  },
  {
    icon: <FiClock />,
    title: 'Longevity & Vitality',
    description:
      'A healthy diet reduces the risk of chronic diseases and promotes longevity.',
  },
  {
    icon: <FiSmile />,
    title: 'Mental Wellbeing',
    description:
      'What you eat affects your mood, concentration, and emotional balance.',
  },
]

const WhyNutrition = () => {
  return (
    <section id="whyNutrition" className="py-20 bg-background text-foreground">
      <div className="container flex flex-col lg:flex-row-reverse justify-between gap-10">
        <motion.div
          initial={{ opacity: 0, x: 100, filter: 'blur(10px)' }}
          whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
          transition={{
            duration: 1,
            delay: 0.1,
            ease: 'anticipate',
          }}
          className="flex-1 mx-auto"
        >
          <h2 className="text-3xl md:text-5xl font-extrabold">
            Why Nutrition Matters
          </h2>
          <p className="font-medium mt-1 mb-5">
            Small choices today create a healthier, happier tomorrow.
          </p>

          <p className="text-muted-foreground">
            Nutrition is the foundation of our health, energy, and well-being.
            Every meal, every snack, and every sip contributes to how we feel,
            perform, and even think. By understanding the impact of food on our
            bodies, we can make conscious choices that fuel vitality, prevent
            illness, and support mental clarity.
            <br />
            <br />
            Good nutrition isn’t about restriction — it’s about balance,
            knowledge, and creating sustainable habits that last a lifetime.
            Whether you want more energy, better focus, or improved mood, proper
            nutrition is the key that unlocks your body’s full potential.
          </p>
        </motion.div>
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {highlights.map((item, index) => {
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -100, filter: 'blur(10px)' }}
                whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                transition={{
                  duration: 1,
                  delay: 0.1 * index,
                  ease: 'easeOut',
                }}
                className="bg-card rounded-xl border border-ring p-6 shadow-lg flex flex-col items-center text-center"
              >
                <div className="bg-accent p-4 rounded-full mb-4 text-accent-foreground text-2xl">
                  {item.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-base">
                  {item.description}
                </p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default WhyNutrition
