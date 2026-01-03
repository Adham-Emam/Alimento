'use client'

import React from 'react'
import {
  FiEdit3,
  FiSunrise,
  FiBarChart2,
  FiActivity,
  FiTarget,
  FiLayout,
} from 'react-icons/fi'
import { motion } from 'framer-motion'

interface cardProps {
  title: string
  icon: React.ReactNode
  description: string
}

const cards: cardProps[] = [
  {
    title: 'Smart Meal Tracking',
    icon: <FiEdit3 />,
    description:
      'Log your meals with ease and gain clear insights into what you’re really eating. No confusion — just simple, meaningful data that helps you stay on track.',
  },
  {
    title: 'Personalized Daily Insights',
    icon: <FiSunrise />,
    description:
      'Receive gentle guidance based on your habits, helping you make better choices every day without feeling overwhelmed.',
  },
  {
    title: 'Nutrition Breakdown',
    icon: <FiBarChart2 />,
    description:
      'Understand your food better with accessible breakdowns of calories, macros, and essential nutrients — all in a clean and readable format.',
  },
  {
    title: 'Habit Monitoring',
    icon: <FiActivity />,
    description:
      'Track patterns in your eating habits and stay consistent with routines that support long-term health.',
  },
  {
    title: 'Goal-Focused Approach',
    icon: <FiTarget />,
    description:
      'Whether your aim is more energy, weight balance, or healthier habits, our platform adapts to your personal goals.',
  },
  {
    title: 'Simple & Elegant Design',
    icon: <FiLayout />,
    description:
      'A clean, calming interface built to support your journey, not distract from it.',
  },
]

const Features = () => {
  return (
    <section id="features" className="bg-card text-card py-20">
      <div className="container">
        <div className="mb-10 text-center">
          <h2 className="text-3xl md:text-5xl font-extrabold">
            Features Designed for a Healthier You
          </h2>
          <p className="text-muted-foreground font-medium mt-1">
            Simple tools crafted to make smarter eating effortless and
            intuitive.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cards.map((card, index) => {
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -100, filter: 'blur(10px)' }}
                whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                transition={{
                  duration: 1,
                  delay: 0.1 * (index % 3),
                  ease: 'anticipate',
                }}
                className="bg-secondary py-8 px-4 rounded-xl text-center"
                style={{ willChange: 'transform, opacity, filter' }}
              >
                <div className="w-fit mx-auto text-accent-foreground text-5xl bg-accent rounded-full p-4 mb-8">
                  {card.icon}
                </div>
                <h3 className="text-lg lg:text-2xl mb-2 font-bold">
                  {card.title}
                </h3>
                <p className="text-muted-foreground">{card.description}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default Features
