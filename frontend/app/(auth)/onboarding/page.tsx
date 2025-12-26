'use client'

import { ChangeEvent, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Leaf,
  User,
  Activity,
  AlertTriangle,
  Target,
  Salad,
  Calculator,
  Loader2,
  Sparkles,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  useOnboarding,
  SexType,
  MeasurementUnitsType,
  ActivityLevelType,
  GoalType,
} from '@/contexts/OnboardingContext'
import { cn } from '@/lib/utils'
import {
  calculateMacroTargets,
  DEFAULT_MACRO_TARGETS,
  MacroTargets,
} from '@/lib/utils'

// ============ Constants ============

const currencies = [
  { id: 'EGP', label: 'EGP (E£)', symbol: 'E£' },
  { id: 'USD', label: 'USD ($)', symbol: '$' },
  { id: 'EUR', label: 'EUR (€)', symbol: '€' },
  { id: 'GBP', label: 'GBP (£)', symbol: '£' },
  { id: 'SAR', label: 'SAR (﷼)', symbol: '﷼' },
]

const sexOptions: { id: SexType; label: string; icon: string }[] = [
  { id: 'male', label: 'Male', icon: '👨' },
  { id: 'female', label: 'Female', icon: '👩' },
]

const measurementUnits: {
  id: MeasurementUnitsType
  label: string
  description: string
}[] = [
  { id: 'metric', label: 'Metric', description: 'm / kg' },
  { id: 'imperial', label: 'Imperial', description: 'ft / lb' },
]

const activityLevels: {
  id: ActivityLevelType
  label: string
  description: string
  icon: string
}[] = [
  {
    id: 'sedentary',
    label: 'Sedentary',
    description: 'Little to no exercise, desk job',
    icon: '🪑',
  },
  {
    id: 'light',
    label: 'Light',
    description: 'Light exercise 1-3 days/week',
    icon: '🚶',
  },
  {
    id: 'moderate',
    label: 'Moderate',
    description: 'Moderate exercise 3-5 days/week',
    icon: '🏃',
  },
  {
    id: 'active',
    label: 'Active',
    description: 'Hard exercise 6-7 days/week',
    icon: '🏋️',
  },
]

const goals: {
  id: GoalType
  label: string
  description: string
  icon: string
}[] = [
  {
    id: 'maintenance',
    label: 'Maintenance',
    description: 'Maintain current weight and body composition',
    icon: '⚖️',
  },
  {
    id: 'cutting',
    label: 'Cutting',
    description: 'Lose fat while preserving muscle mass',
    icon: '🔥',
  },
  {
    id: 'bulking',
    label: 'Bulking',
    description: 'Build muscle with calorie surplus',
    icon: '💪',
  },
  {
    id: 'recomp',
    label: 'Recomp',
    description: 'Build muscle and lose fat simultaneously',
    icon: '🎯',
  },
]

const dietaryOptions = [
  { id: 'vegetarian', label: 'Vegetarian', icon: '🥬' },
  { id: 'vegan', label: 'Vegan', icon: '🌱' },
  { id: 'keto', label: 'Keto', icon: '🥑' },
  { id: 'paleo', label: 'Paleo', icon: '🥩' },
  { id: 'mediterranean', label: 'Mediterranean', icon: '🫒' },
  { id: 'gluten-free', label: 'Gluten-Free', icon: '🌾' },
  { id: 'dairy-free', label: 'Dairy-Free', icon: '🥛' },
  { id: 'halal', label: 'Halal', icon: '🍖' },
]

const allergens = [
  { id: 'nuts', label: 'Nuts', icon: '🥜' },
  { id: 'dairy', label: 'Dairy', icon: '🧀' },
  { id: 'eggs', label: 'Eggs', icon: '🥚' },
  { id: 'shellfish', label: 'Shellfish', icon: '🦐' },
  { id: 'fish', label: 'Fish', icon: '🐟' },
  { id: 'legumes', label: 'Legumes', icon: '🫘' },
  { id: 'gluten', label: 'Gluten', icon: '🌾' },
]

const medicalConditions = [
  { id: 'diabetes', label: 'Diabetes', icon: '💉' },
  { id: 'hypertension', label: 'Hypertension', icon: '❤️' },
  { id: 'heart-disease', label: 'Heart Disease', icon: '🫀' },
  { id: 'celiac', label: 'Celiac Disease', icon: '🌾' },
  { id: 'ibs', label: 'IBS', icon: '🔄' },
  { id: 'kidney-disease', label: 'Kidney Disease', icon: '🫘' },
]

// ============ Components ============

interface SelectableCardProps {
  selected: boolean
  onClick: () => void
  icon: string
  label: string
  description?: string
  className?: string
}

function SelectableCard({
  selected,
  onClick,
  icon,
  label,
  description,
  className,
}: SelectableCardProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        'relative rounded-2xl p-4 text-left transition-all border-2',
        selected
          ? 'border-primary bg-primary/10 shadow-soft'
          : 'border-border bg-card hover:border-primary/50',
        className
      )}
    >
      {selected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center"
        >
          <Check className="w-3 h-3 text-primary-foreground" />
        </motion.div>
      )}
      <span className="text-2xl mb-2 block">{icon}</span>
      <span className="font-medium text-foreground block">{label}</span>
      {description && (
        <span className="text-sm text-muted-foreground">{description}</span>
      )}
    </motion.button>
  )
}

// ============ Main Component ============

export default function Onboarding() {
  const {
    step,
    totalSteps,
    data,
    isLoading,
    error,
    nextStep,
    prevStep,
    setProfileData,
    setHealthData,
    complete,
  } = useOnboarding()

  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  // Check if profile has all required data for macro calculation
  const canCalculateMacros = useMemo(() => {
    const { weight_kg, height_cm, birth_date, sex, activity_level, goal } =
      data.profile
    return !!(
      weight_kg > 0 &&
      height_cm > 0 &&
      birth_date &&
      sex &&
      ['male', 'female'].includes(sex) &&
      activity_level &&
      goal &&
      ['maintenance', 'cutting', 'bulking', 'recomp'].includes(goal)
    )
  }, [data.profile])

  // Calculate suggested macros using the TDEE calculator
  const getSuggestedMacros = (): MacroTargets => {
    if (!canCalculateMacros) {
      return DEFAULT_MACRO_TARGETS
    }

    try {
      return calculateMacroTargets({
        weight_kg: data.profile.weight_kg,
        height_cm: data.profile.height_cm,
        birth_date: data.profile.birth_date,
        sex: data.profile.sex as 'male' | 'female',
        activity_level: data.profile.activity_level as
          | 'sedentary'
          | 'light'
          | 'moderate'
          | 'active',
        goal: data.profile.goal as
          | 'maintenance'
          | 'cutting'
          | 'bulking'
          | 'recomp',
      })
    } catch (error) {
      console.error('Error calculating macros:', error)
      return DEFAULT_MACRO_TARGETS
    }
  }

  // Apply suggested macros
  const handleApplySuggestedMacros = () => {
    const suggestedMacros = getSuggestedMacros()
    setHealthData({ target_macros: suggestedMacros })
  }

  // Validation for each step
  const isStepValid = useMemo(() => {
    switch (step) {
      case 1:
        return !!(
          data.profile.birth_date &&
          data.profile.sex &&
          ['male', 'female'].includes(data.profile.sex) &&
          data.profile.height_cm > 0 &&
          data.profile.weight_kg > 0
        )
      case 2:
        return !!(
          data.profile.activity_level &&
          ['sedentary', 'light', 'moderate', 'active'].includes(
            data.profile.activity_level
          )
        )
      case 3:
        return !!(
          data.profile.goal &&
          ['maintenance', 'cutting', 'bulking', 'recomp'].includes(
            data.profile.goal
          )
        )
      case 4:
        return true
      case 5:
        return true
      case 6:
        return !!(
          data.health_data.target_macros.calories > 0 &&
          data.health_data.target_macros.protein_g > 0 &&
          data.health_data.target_macros.carbs_g > 0 &&
          data.health_data.target_macros.fats_g > 0
        )
      default:
        return false
    }
  }, [step, data])

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

  const handleNextStep = () => {
    if (isStepValid) {
      setSubmitError(null)
      nextStep()
    } else {
      setSubmitError('Please complete all required fields before continuing')
    }
  }

  const handleComplete = async () => {
    if (!isStepValid) {
      setSubmitError('Please complete all required fields')
      return
    }

    try {
      setIsSubmitting(true)
      setSubmitError(null)
      await complete()
      router.push('/dashboard')
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : 'Failed to complete onboarding'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const stepIcons = [User, Activity, Target, Salad, AlertTriangle, Calculator]
  const stepTitles = [
    'Personal Information',
    'Activity Level',
    'Your Goal',
    'Dietary Preferences',
    'Allergies & Conditions',
    'Macro Targets',
  ]

  const stepDescriptions = [
    'Tell us about yourself to personalize your experience',
    'Select your typical activity level',
    "What's your primary fitness goal?",
    'Select your dietary preferences (optional)',
    'Let us know about any allergies or medical conditions (optional)',
    'Set your daily nutrition targets',
  ]

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-hero pb-24">
      {/* Error Banner */}
      {(error || submitError) && (
        <div className="bg-destructive/10 border-b border-destructive/20 px-4 py-3">
          <div className="container mx-auto">
            <p className="text-sm text-destructive text-center">
              {error || submitError}
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
              <Leaf className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-gradient">Aliménto</span>
          </div>
          <span className="text-sm text-muted-foreground">
            Step {step} of {totalSteps}
          </span>
        </div>
      </div>

      {/* Progress */}
      <div className="container mx-auto px-4 mb-8">
        <div className="flex items-center justify-center gap-2 max-w-2xl mx-auto overflow-x-auto pb-2">
          {Array.from({ length: totalSteps }, (_, i) => i + 1).map((s) => {
            const Icon = stepIcons[s - 1]
            return (
              <div key={s} className="flex items-center shrink-0">
                <div
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center transition-colors',
                    s < step && 'bg-primary text-primary-foreground',
                    s === step &&
                      'bg-primary text-primary-foreground ring-4 ring-primary/20',
                    s > step && 'bg-muted text-muted-foreground'
                  )}
                >
                  {s < step ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <Icon className="w-5 h-5" />
                  )}
                </div>
                {s < totalSteps && (
                  <div
                    className={cn(
                      'w-8 sm:w-12 h-1 rounded-full mx-1',
                      s < step ? 'bg-primary' : 'bg-muted'
                    )}
                  />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Content */}
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

            {/* Step 1: Personal Information */}
            {step === 1 && (
              <div className="space-y-6 bg-card rounded-2xl p-6 shadow-soft">
                {/* Birth Date */}
                <div className="space-y-2">
                  <Label htmlFor="birth_date">
                    Date of Birth <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="birth_date"
                    type="date"
                    value={data.profile.birth_date}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setProfileData({ birth_date: e.target.value })
                    }
                    className={cn(
                      'h-12',
                      !data.profile.birth_date &&
                        submitError &&
                        'border-destructive'
                    )}
                    max={new Date().toISOString().split('T')[0]}
                  />
                </div>

                {/* Sex */}
                <div className="space-y-2">
                  <Label>
                    Sex <span className="text-destructive">*</span>
                  </Label>
                  <div className="grid grid-cols-2 gap-3">
                    {sexOptions.map((option) => (
                      <SelectableCard
                        key={option.id}
                        selected={data.profile.sex === option.id}
                        onClick={() => setProfileData({ sex: option.id })}
                        icon={option.icon}
                        label={option.label}
                        className={cn(
                          !data.profile.sex &&
                            submitError &&
                            'border-destructive'
                        )}
                      />
                    ))}
                  </div>
                </div>

                {/* Measurement Units */}
                <div className="space-y-2">
                  <Label>Measurement Units</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {measurementUnits.map((unit) => (
                      <motion.button
                        key={unit.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() =>
                          setProfileData({ measurement_units: unit.id })
                        }
                        className={cn(
                          'rounded-xl p-4 text-center transition-all border-2',
                          data.profile.measurement_units === unit.id
                            ? 'border-primary bg-primary/10'
                            : 'border-border bg-background hover:border-primary/50'
                        )}
                      >
                        <span className="font-medium block">{unit.label}</span>
                        <span className="text-sm text-muted-foreground">
                          {unit.description}
                        </span>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Height & Weight */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="height">
                      Height (
                      {data.profile.measurement_units === 'metric'
                        ? 'cm'
                        : 'ft'}
                      ) <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="height"
                      type="number"
                      value={data.profile.height_cm || ''}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setProfileData({
                          height_cm: parseInt(e.target.value) || 0,
                        })
                      }
                      className={cn(
                        'h-12',
                        (!data.profile.height_cm ||
                          data.profile.height_cm <= 0) &&
                          submitError &&
                          'border-destructive'
                      )}
                      min={1}
                      placeholder={
                        data.profile.measurement_units === 'metric'
                          ? '170'
                          : '67'
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="weight">
                      Weight (
                      {data.profile.measurement_units === 'metric'
                        ? 'kg'
                        : 'lbs'}
                      ) <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="weight"
                      type="number"
                      value={data.profile.weight_kg || ''}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setProfileData({
                          weight_kg: parseFloat(e.target.value) || 0,
                        })
                      }
                      className={cn(
                        'h-12',
                        (!data.profile.weight_kg ||
                          data.profile.weight_kg <= 0) &&
                          submitError &&
                          'border-destructive'
                      )}
                      min={1}
                      step="0.1"
                      placeholder={
                        data.profile.measurement_units === 'metric'
                          ? '70'
                          : '154'
                      }
                    />
                  </div>
                </div>

                {/* Currency */}
                <div className="space-y-2">
                  <Label>Preferred Currency</Label>
                  <div className="grid grid-cols-5 gap-2">
                    {currencies.map((currency) => (
                      <motion.button
                        key={currency.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() =>
                          setProfileData({ preferred_currency: currency.id })
                        }
                        className={cn(
                          'rounded-lg p-3 text-center transition-all border-2',
                          data.profile.preferred_currency === currency.id
                            ? 'border-primary bg-primary/10'
                            : 'border-border bg-background hover:border-primary/50'
                        )}
                      >
                        <span className="font-medium text-sm">
                          {currency.id}
                        </span>
                      </motion.button>
                    ))}
                  </div>
                </div>

                <p className="text-xs text-muted-foreground">
                  <span className="text-destructive">*</span> Required fields
                </p>
              </div>
            )}

            {/* Step 2: Activity Level */}
            {step === 2 && (
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
                      <span className="text-muted-foreground">
                        {level.description}
                      </span>
                    </div>
                  </motion.button>
                ))}
              </div>
            )}

            {/* Step 3: Goal */}
            {step === 3 && (
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
                      <span className="text-muted-foreground">
                        {goal.description}
                      </span>
                    </div>
                  </motion.button>
                ))}
              </div>
            )}

            {/* Step 4: Dietary Preferences */}
            {step === 4 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {dietaryOptions.map((option) => (
                    <SelectableCard
                      key={option.id}
                      selected={data.health_data.dietary_preferences.includes(
                        option.id
                      )}
                      onClick={() =>
                        handleToggleHealth('dietary_preferences', option.id)
                      }
                      icon={option.icon}
                      label={option.label}
                    />
                  ))}
                </div>
                <p className="text-center text-sm text-muted-foreground">
                  Select all that apply. You can skip this step if none apply.
                </p>
              </div>
            )}

            {/* Step 5: Allergies & Medical Conditions */}
            {step === 5 && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-foreground">
                    Allergies
                  </h3>
                  <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                    {allergens.map((allergen) => (
                      <SelectableCard
                        key={allergen.id}
                        selected={data.health_data.allergies.includes(
                          allergen.id
                        )}
                        onClick={() =>
                          handleToggleHealth('allergies', allergen.id)
                        }
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
                    This helps us provide safer meal recommendations. Skip if
                    none apply.
                  </p>
                </div>
              </div>
            )}

            {/* Step 6: Macro Targets */}
            {step === 6 && (
              <div className="space-y-6 bg-card rounded-2xl p-6 shadow-soft">
                {/* Suggested Macros Banner */}
                <div className="bg-linear-to-r from-primary/10 to-primary/5 rounded-xl p-4 border border-primary/20">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                      <Sparkles className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground mb-1">
                        Personalized Recommendation
                      </h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Based on your profile and{' '}
                        <strong className="text-foreground">
                          {goals.find((g) => g.id === data.profile.goal)
                            ?.label || 'fitness'}
                        </strong>{' '}
                        goal, we&apos;ve calculated your optimal daily targets
                        using the Mifflin-St Jeor equation.
                      </p>
                      <Button
                        variant="default"
                        size="sm"
                        onClick={handleApplySuggestedMacros}
                        disabled={!canCalculateMacros}
                        className="gap-2"
                      >
                        <Calculator className="w-4 h-4" />
                        Apply Suggested Macros
                      </Button>
                      {!canCalculateMacros && (
                        <p className="text-xs text-amber-600 mt-2">
                          Complete your profile information to get personalized
                          recommendations.
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Preview of suggested values */}
                  {canCalculateMacros && (
                    <div className="mt-4 pt-4 border-t border-primary/20">
                      <p className="text-xs text-muted-foreground mb-2">
                        Suggested values:
                      </p>
                      <div className="grid grid-cols-4 gap-2 text-center">
                        {(() => {
                          const suggested = getSuggestedMacros()
                          return (
                            <>
                              <div className="bg-background/50 rounded-lg p-2">
                                <span className="text-sm font-bold text-primary block">
                                  {suggested.calories}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  kcal
                                </span>
                              </div>
                              <div className="bg-background/50 rounded-lg p-2">
                                <span className="text-sm font-bold text-blue-500 block">
                                  {suggested.protein_g}g
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  protein
                                </span>
                              </div>
                              <div className="bg-background/50 rounded-lg p-2">
                                <span className="text-sm font-bold text-amber-500 block">
                                  {suggested.carbs_g}g
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  carbs
                                </span>
                              </div>
                              <div className="bg-background/50 rounded-lg p-2">
                                <span className="text-sm font-bold text-rose-500 block">
                                  {suggested.fats_g}g
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  fats
                                </span>
                              </div>
                            </>
                          )
                        })()}
                      </div>
                    </div>
                  )}
                </div>

                {/* Manual Input Fields */}
                <div className="space-y-4">
                  <h4 className="font-medium text-foreground">
                    Or set your own targets:
                  </h4>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="calories">
                        Daily Calories{' '}
                        <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="calories"
                        type="number"
                        value={data.health_data.target_macros.calories || ''}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          setHealthData({
                            target_macros: {
                              ...data.health_data.target_macros,
                              calories: parseInt(e.target.value) || 0,
                            },
                          })
                        }
                        className={cn(
                          'h-12 text-lg font-semibold',
                          (!data.health_data.target_macros.calories ||
                            data.health_data.target_macros.calories <= 0) &&
                            submitError &&
                            'border-destructive'
                        )}
                        min={1}
                        placeholder="2000"
                      />
                      <span className="text-xs text-muted-foreground">
                        kcal/day
                      </span>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="protein">
                        Protein <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="protein"
                        type="number"
                        value={data.health_data.target_macros.protein_g || ''}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          setHealthData({
                            target_macros: {
                              ...data.health_data.target_macros,
                              protein_g: parseInt(e.target.value) || 0,
                            },
                          })
                        }
                        className={cn(
                          'h-12 text-lg font-semibold',
                          (!data.health_data.target_macros.protein_g ||
                            data.health_data.target_macros.protein_g <= 0) &&
                            submitError &&
                            'border-destructive'
                        )}
                        min={1}
                        placeholder="150"
                      />
                      <span className="text-xs text-muted-foreground">
                        grams/day
                      </span>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="carbs">
                        Carbohydrates{' '}
                        <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="carbs"
                        type="number"
                        value={data.health_data.target_macros.carbs_g || ''}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          setHealthData({
                            target_macros: {
                              ...data.health_data.target_macros,
                              carbs_g: parseInt(e.target.value) || 0,
                            },
                          })
                        }
                        className={cn(
                          'h-12 text-lg font-semibold',
                          (!data.health_data.target_macros.carbs_g ||
                            data.health_data.target_macros.carbs_g <= 0) &&
                            submitError &&
                            'border-destructive'
                        )}
                        min={1}
                        placeholder="200"
                      />
                      <span className="text-xs text-muted-foreground">
                        grams/day
                      </span>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="fats">
                        Fats <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="fats"
                        type="number"
                        value={data.health_data.target_macros.fats_g || ''}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          setHealthData({
                            target_macros: {
                              ...data.health_data.target_macros,
                              fats_g: parseInt(e.target.value) || 0,
                            },
                          })
                        }
                        className={cn(
                          'h-12 text-lg font-semibold',
                          (!data.health_data.target_macros.fats_g ||
                            data.health_data.target_macros.fats_g <= 0) &&
                            submitError &&
                            'border-destructive'
                        )}
                        min={1}
                        placeholder="65"
                      />
                      <span className="text-xs text-muted-foreground">
                        grams/day
                      </span>
                    </div>
                  </div>
                </div>

                {/* Current Macro Summary */}
                <div className="bg-muted/50 rounded-xl p-4">
                  <h4 className="font-medium mb-3 text-foreground">
                    Your Daily Targets
                  </h4>
                  <div className="grid grid-cols-4 gap-2 text-center">
                    <div className="bg-background rounded-lg p-3">
                      <span className="text-xl font-bold text-primary block">
                        {data.health_data.target_macros.calories || 0}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Calories
                      </span>
                    </div>
                    <div className="bg-background rounded-lg p-3">
                      <span className="text-xl font-bold text-blue-500 block">
                        {data.health_data.target_macros.protein_g || 0}g
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Protein
                      </span>
                    </div>
                    <div className="bg-background rounded-lg p-3">
                      <span className="text-xl font-bold text-amber-500 block">
                        {data.health_data.target_macros.carbs_g || 0}g
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Carbs
                      </span>
                    </div>
                    <div className="bg-background rounded-lg p-3">
                      <span className="text-xl font-bold text-rose-500 block">
                        {data.health_data.target_macros.fats_g || 0}g
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Fats
                      </span>
                    </div>
                  </div>

                  {/* Calorie breakdown */}
                  {data.health_data.target_macros.calories > 0 && (
                    <div className="mt-3 pt-3 border-t border-border">
                      <p className="text-xs text-muted-foreground text-center">
                        Total from macros:{' '}
                        <span className="font-medium text-foreground">
                          {data.health_data.target_macros.protein_g * 4 +
                            data.health_data.target_macros.carbs_g * 4 +
                            data.health_data.target_macros.fats_g * 9}{' '}
                          kcal
                        </span>
                        {' • '}
                        Protein:{' '}
                        {Math.round(
                          ((data.health_data.target_macros.protein_g * 4) /
                            data.health_data.target_macros.calories) *
                            100
                        )}
                        % | Carbs:{' '}
                        {Math.round(
                          ((data.health_data.target_macros.carbs_g * 4) /
                            data.health_data.target_macros.calories) *
                            100
                        )}
                        % | Fats:{' '}
                        {Math.round(
                          ((data.health_data.target_macros.fats_g * 9) /
                            data.health_data.target_macros.calories) *
                            100
                        )}
                        %
                      </p>
                    </div>
                  )}
                </div>

                <p className="text-xs text-muted-foreground">
                  <span className="text-destructive">*</span> Required fields
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-card/80 backdrop-blur-xl border-t border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={prevStep}
            disabled={step === 1 || isSubmitting}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>

          {step < totalSteps ? (
            <Button
              onClick={handleNextStep}
              className="gap-2"
              disabled={isSubmitting}
            >
              Continue
              <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              onClick={handleComplete}
              className="gap-2"
              disabled={isSubmitting || !isStepValid}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  Complete Setup
                  <Check className="w-4 h-4" />
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
