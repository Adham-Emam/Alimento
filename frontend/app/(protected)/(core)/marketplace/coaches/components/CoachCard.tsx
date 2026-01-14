import { motion } from 'framer-motion'
import { Coach } from '@/types'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function CoachCard(coach: Coach) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -50, boxShadow: '0 0 0 0 rgba(0, 0, 0, 0)' }}
      animate={{
        opacity: 1,
        x: 0,
        boxShadow:
          '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
      }}
      transition={{
        duration: 0.3,
        delay: (coach.user % 3) * 0.1,
        ease: 'easeOut',
      }}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className="border rounded-xl p-5 bg-card flex flex-col gap-3"
    >
      <p className="text-medium font-semibold">{coach.full_name}</p>
      <h3 className="font-semibold text-lg">{coach.title}</h3>

      <p className="text-sm text-muted-foreground line-clamp-3">{coach.bio}</p>

      <div className="text-sm space-y-1">
        <p>
          <span className="font-medium">Specialization:</span>{' '}
          {coach.specialization.map((s) => s).join(', ')}
        </p>
        <p>
          <span className="font-medium">Experience:</span>{' '}
          {coach.experience_years} years
        </p>
        <p>
          <span className="font-medium">Languages:</span>{' '}
          {coach.languages.map((l) => l).join(', ')}
        </p>
      </div>

      <div className="mt-auto flex items-center justify-between pt-3">
        <span className="font-semibold">${coach.monthly_rate}/month</span>
        <Button variant="secondary" asChild>
          <Link href={`/marketplace/coaches/${encodeURIComponent(coach.user)}`}>
            View Profile
          </Link>
        </Button>
      </div>
    </motion.div>
  )
}
