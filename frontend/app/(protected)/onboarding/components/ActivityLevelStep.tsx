import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { activityLevels } from '@/constants/onboarding'
import { useOnboarding } from '@/components/OnboardingProvider'

export default function ActivityLevelStep() {
  const { data, setProfileData } = useOnboarding()

  return (
    <div className="space-y-3">
      {activityLevels.map((level) => (
        <motion.button
          key={level.id}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => setProfileData({ activity_level: level.id })}
          className={cn(
            'w-full rounded-2xl p-5 text-left transition-all border-2 flex items-center gap-4',
            data.profile.activity_level === level.id
              ? 'border-primary bg-primary/10 shadow-soft'
              : 'border-border bg-card hover:border-primary/50'
          )}
        >
          <span className="text-3xl">{level.icon}</span>
          <div>
            <span className="font-semibold text-lg text-foreground block">
              {level.label}
            </span>
            <span className="text-muted-foreground">{level.description}</span>
          </div>
        </motion.button>
      ))}
    </div>
  )
}
