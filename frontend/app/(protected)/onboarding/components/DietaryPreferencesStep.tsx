import SelectableCard from './SelectableCard'
import { dietaryOptions } from '@/constants/onboarding'
import { useOnboarding } from '@/components/OnboardingProvider'

interface Props {
  handleToggleHealth: (type: 'dietary_preferences', id: string) => void
}

export default function DietaryPreferencesStep({ handleToggleHealth }: Props) {
  const { data } = useOnboarding()

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {dietaryOptions.map((option) => (
          <SelectableCard
            key={option.id}
            selected={data.health_data.dietary_preferences.includes(option.id)}
            onClick={() => handleToggleHealth('dietary_preferences', option.id)}
            icon={option.icon}
            label={option.label}
          />
        ))}
      </div>
      <p className="text-center text-sm text-muted-foreground">
        Select all that apply. You can skip this step if none apply.
      </p>
    </div>
  )
}
