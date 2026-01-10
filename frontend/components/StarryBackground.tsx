'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface StarProps {
  id: number
  size: 'small' | 'medium' | 'big'
  top: number
  left: number
  duration: number
  delay: number
}

export default function StarryBackground() {
  const [stars, setStars] = useState<StarProps[]>([])

  // Colors derived from SCSS
  // $blue: #03061A
  // $panko: #EDCDA3
  // $white: #FFFFFF

  useEffect(() => {
    // Generate stars on client-side to avoid hydration mismatch
    const starCount = 150
    const wH = window.innerHeight
    const wW = window.innerWidth
    const newStars: StarProps[] = []

    for (let i = 0; i < starCount; i++) {
      let size: 'small' | 'medium' | 'big' = 'small'

      // Original logic: i % 20 == big, i % 9 == medium
      if (i % 20 === 0) size = 'big'
      else if (i % 9 === 0) size = 'medium'

      newStars.push({
        id: i,
        size,
        top: Math.round(Math.random() * wH),
        left: Math.round(Math.random() * wW),
        // Random duration between 3s and 6s
        duration: Math.random() * 3 + 3,
        delay: Math.random() * 3,
      })
    }
    setStars(newStars)
  }, [])

  return (
    <div className="fixed inset-0 z-500 overflow-hidden bg-accent/50 pointer-events-none">
      {stars.map((star) => {
        // Dynamic styling based on size
        let sizeClass = 'w-[3px] h-[3px]'
        let shadowStyle =
          '0 0 40px 0 rgba(237, 205, 163, 0.8), 0 0 20px 0 #FFFFFF'

        if (star.size === 'medium') {
          sizeClass = 'w-[6px] h-[6px]'
        } else if (star.size === 'big') {
          sizeClass = 'w-[9px] h-[9px]'
          shadowStyle =
            '0 0 40px 0 #EDCDA3, 0 0 20px 0 #FFFFFF, inset 0 0 4px #FFFFFF'
        }

        return (
          <motion.div
            key={star.id}
            className={`absolute rounded-full bg-foreground/80 pointer-events-none ${sizeClass}`}
            style={{
              top: star.top,
              left: star.left,
              boxShadow: shadowStyle,
            }}
            // Framer Motion Animation (Glow)
            animate={{
              opacity: [0.9, 0.2, 0.9],
            }}
            transition={{
              duration: star.duration,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: star.delay,
            }}
          />
        )
      })}

      {/* Comet Animation */}
      <motion.div
        className="absolute top-0 left-[80%] h-1.5 w-1.5 rounded-full bg-foreground/60 pointer-events-none"
        style={{
          boxShadow:
            '0 0 40px 0 #EDCDA3, 0 0 20px 0 #FFFFFF, inset 0 0 8px rgba(255,255,255,0.6)',
        }}
        // Initial Position
        initial={{
          x: 0,
          y: -50,
          opacity: 0.3,
          rotate: -45, // Comet angle
        }}
        // Animation Steps
        animate={{
          x: ['0vw', '-120vw', '-120vw'], // Move across screen
          opacity: [0.3, 1, 0, 0], // Fade in then out
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'linear',
          times: [0, 0.1, 0.2, 1], // Matches keyframe percentages: 0%, 10%, 20%, 100%
        }}
      >
        {/* Comet Tail */}
        <div
          className="absolute top-0 left-0 -z-10 h-1..5 w-[20vw] rounded-full bg-background/10"
          style={{ boxShadow: '0 0 20px rgba(237, 205, 163, 0.4)' }}
        />
      </motion.div>
    </div>
  )
}
