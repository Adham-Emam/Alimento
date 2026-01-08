import { useOnboarding } from '@/components/OnboardingProvider'
import SelectableCard from './SelectableCard'
import { allergens, medicalConditions } from '@/constants/onboarding'

interface Props {
  handleToggleHealth: (
    type: 'allergies' | 'medical_conditions',
    id: string
  ) => void
}

export default function AllergiesMedicalStep({ handleToggleHealth }: Props) {
  const { data } = useOnboarding()

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4 text-foreground">
          Allergies
        </h3>
        <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
          {allergens.map((allergen) => (
            <SelectableCard
              key={allergen.id}
              selected={data.health_data.allergies.includes(allergen.id)}
              onClick={() => handleToggleHealth('allergies', allergen.id)}
              icon={allergen.icon}
              label={allergen.label}
            />
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4 text-foreground">
          Medical Conditions
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {medicalConditions.map((condition) => (
            <SelectableCard
              key={condition.id}
              selected={data.health_data.medical_conditions.includes(
                condition.id
              )}
              onClick={() =>
                handleToggleHealth('medical_conditions', condition.id)
              }
              icon={condition.icon}
              label={condition.label}
            />
          ))}
        </div>
        <p className="text-center text-sm text-muted-foreground mt-4">
          This helps us provide safer meal recommendations. Skip if none apply.
        </p>
      </div>
    </div>
  )
}
