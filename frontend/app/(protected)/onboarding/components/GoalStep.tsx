import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { goals } from '@/constants/onboarding'
import { useOnboarding } from '@/components/OnboardingProvider'

export default function GoalStep() {
  const { data, setProfileData } = useOnboarding()

  return (
    <div className="space-y-4">
      {goals.map((goal) => (
        <motion.button
          key={goal.id}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => setProfileData({ goal: goal.id })}
          className={cn(
            'w-full rounded-2xl p-6 text-left transition-all border-2 flex items-center gap-4',
            data.profile.goal === goal.id
              ? 'border-primary bg-primary/10 shadow-soft'
              : 'border-border bg-card hover:border-primary/50'
          )}
        >
          <span className="text-4xl">{goal.icon}</span>
          <div>
            <span className="font-semibold text-xl text-foreground block">
              {goal.label}
            </span>
            <span className="text-muted-foreground">{goal.description}</span>
          </div>
        </motion.button>
      ))}
    </div>
  )
}
