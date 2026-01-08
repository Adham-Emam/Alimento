import { AnimatePresence, motion } from 'framer-motion'
import { useOnboarding } from '@/components/OnboardingProvider'
import { stepTitles, stepDescriptions } from '@/constants/onboarding'
import PersonalInfoStep from './PersonalInfoStep'
import ActivityLevelStep from './ActivityLevelStep'
import GoalStep from './GoalStep'
import DietaryPreferencesStep from './DietaryPreferencesStep'
import AllergiesMedicalStep from './AllergiesMedicalStep'
import MacroTargetsStep from './MacroTargetsStep'

interface Props {
  stepErrors: Record<string, string | null>
  submitError: string | null
}

export default function StepsContent({ stepErrors, submitError }: Props) {
  const { data, step, setHealthData } = useOnboarding()

  const handleToggleHealth = (
    key: 'dietary_preferences' | 'allergies' | 'medical_conditions',
    value: string
  ) => {
    const current = data.health_data[key] as string[]
    if (current.includes(value)) {
      setHealthData({ [key]: current.filter((v) => v !== value) })
    } else {
      setHealthData({ [key]: [...current, value] })
    }
  }

  const getCurrentStepCard = () => {
    switch (step) {
      case 1:
        return (
          <PersonalInfoStep stepErrors={stepErrors} submitError={submitError} />
        )
      case 2:
        return <ActivityLevelStep />
      case 3:
        return <GoalStep />
      case 4:
        return (
          <DietaryPreferencesStep handleToggleHealth={handleToggleHealth} />
        )
      case 5:
        return <AllergiesMedicalStep handleToggleHealth={handleToggleHealth} />
      case 6:
        return <MacroTargetsStep submitError={submitError} />
    }
  }

  return (
    <div className="container mx-auto px-4 pb-12">
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="max-w-2xl mx-auto"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              {stepTitles[step - 1]}
            </h1>
            <p className="text-muted-foreground">
              {stepDescriptions[step - 1]}
            </p>
          </div>

          {getCurrentStepCard()}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
