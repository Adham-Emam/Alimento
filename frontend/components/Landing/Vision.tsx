'use client'
import Image from 'next/image'
import { motion } from 'motion/react'
import { useTheme } from '@/contexts/ThemeContext'
import { FiTarget, FiUsers } from 'react-icons/fi'
import { RiLeafLine } from 'react-icons/ri'
import VisionImageLight from '@/public/vision-section-light.svg'
import VisionImage from '@/public/vision-section.svg'

interface VisionPointProps {
  icon: React.ReactNode
  title: string
  description: string
}

const visionPoints: VisionPointProps[] = [
  {
    icon: <FiTarget />,
    title: 'Accessible Guidance',
    description: 'Nutrition insights that anyone can follow.',
  },
  {
    icon: <FiUsers />,
    title: 'Empowering Choices',
    description: 'Helping you understand your food, not restrict it.',
  },
  {
    icon: <RiLeafLine />,
    title: 'Sustainable Habits',
    description: 'Encouraging long-term, healthy lifestyle patterns.',
  },
]

const Vision = () => {
  const { theme } = useTheme()

  return (
    <section id="vision" className="py-20 bg-background text-foreground">
      <div className="container mx-auto px-6 lg:px-20 flex flex-col lg:flex-row items-center lg:items-start gap-12">
        <div className="flex-1 text-center lg:text-left">
          <h2 className="text-3xl md:text-5xl font-extrabold">Our Vision</h2>
          <p className="font-medium mt-1 mb-8">
            Empowering everyone to live healthier, happier lives through simple,
            mindful nutrition.
          </p>
          <p className="text-muted-foreground mb-8">
            We believe that good nutrition should be{' '}
            <strong>simple, accessible, and empowering</strong>. Our platform is
            built to guide individuals of all ages and lifestyles toward a
            balanced approach to eating.
            <br />
            <br />
            Our vision is a world where people understand the impact of their
            food choices and feel confident making decisions that nurture their
            body and mind. We aim to transform nutrition from a source of
            confusion into a source of
            <strong> clarity, energy, and vitality</strong>, helping everyone
            build sustainable habits that last a lifetime.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {visionPoints.map((item, index) => {
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

        <motion.div
          initial={{ opacity: 0, x: 100, filter: 'blur(10px)' }}
          whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
          transition={{
            duration: 1,
            delay: 0.1,
            ease: 'easeOut',
          }}
          className="flex-1 flex justify-center lg:justify-end"
        >
          <Image
            src={theme === 'dark' ? VisionImageLight : VisionImage}
            width={488}
            height={488}
            alt="Vision Image"
          />
        </motion.div>
      </div>
    </section>
  )
}
export default Vision
