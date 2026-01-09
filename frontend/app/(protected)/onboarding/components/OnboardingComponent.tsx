'use client'

import { useState, useMemo } from 'react'
import { cn } from '@/lib/utils'
import * as Yup from 'yup'
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
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useOnboarding } from '@/components/OnboardingProvider'
import StepsContent from './StepsContent'

const today = new Date()
const minBirthDate = new Date(
  today.getFullYear() - 100,
  today.getMonth(),
  today.getDate()
)
const maxBirthDate = new Date(
  today.getFullYear() - 12,
  today.getMonth(),
  today.getDate()
)

// Validation schemas for each step
const stepValidationSchemas = {
  1: Yup.object().shape({
    profile: Yup.object().shape({
      birth_date: Yup.date()
        .typeError('Invalid birth date')
        .min(minBirthDate, 'Age must be less than 100 years')
        .max(maxBirthDate, 'You must be at least 12 years old')
        .required('Date of birth is required'),
      sex: Yup.string()
        .oneOf(['male', 'female'], 'Please select a valid sex')
        .required('Sex is required'),
      height_cm: Yup.number()
        .required('Height is required')
        .positive('Height must be positive')
        .min(50, 'Height must be at least 50 cm')
        .max(250, 'Height must be less than 250 cm'),
      weight_kg: Yup.number()
        .required('Weight is required')
        .positive('Weight must be positive')
        .min(20, 'Weight must be at least 20 kg')
        .max(300, 'Weight must be less than 300 kg'),
    }),
  }),
  2: Yup.object().shape({
    profile: Yup.object().shape({
      activity_level: Yup.string()
        .oneOf(
          ['sedentary', 'light', 'moderate', 'active'],
          'Please select a valid activity level'
        )
        .required('Activity level is required'),
    }),
  }),
  3: Yup.object().shape({
    profile: Yup.object().shape({
      goal: Yup.string()
        .oneOf(
          ['maintenance', 'cutting', 'bulking', 'recomp'],
          'Please select a valid goal'
        )
        .required('Goal is required'),
    }),
  }),
  4: Yup.object().shape({
    // Dietary preferences are optional
  }),
  5: Yup.object().shape({
    // Allergies and medical conditions are optional
  }),
  6: Yup.object().shape({
    health_data: Yup.object().shape({
      target_macros: Yup.object().shape({
        calories: Yup.number()
          .required('Calories are required')
          .positive('Calories must be positive')
          .min(500, 'Calories must be at least 500')
          .max(10000, 'Calories must be less than 10,000'),
        protein_g: Yup.number()
          .required('Protein is required')
          .positive('Protein must be positive')
          .min(10, 'Protein must be at least 10g')
          .max(1000, 'Protein must be less than 1000g'),
        carbs_g: Yup.number()
          .required('Carbs are required')
          .positive('Carbs must be positive')
          .min(10, 'Carbs must be at least 10g')
          .max(2000, 'Carbs must be less than 2000g'),
        fats_g: Yup.number()
          .required('Fats are required')
          .positive('Fats must be positive')
          .min(10, 'Fats must be at least 10g')
          .max(500, 'Fats must be less than 500g'),
      }),
    }),
  }),
}

export default function OnboardingComponent() {
  const {
    step,
    totalSteps,
    data,
    isLoading,
    error,
    nextStep,
    prevStep,
    complete,
  } = useOnboarding()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  // Validation for each step using Yup
  const { isStepValid, stepErrors } = useMemo(() => {
    try {
      const schema =
        stepValidationSchemas[step as keyof typeof stepValidationSchemas]
      if (schema) {
        schema.validateSync(data, { abortEarly: false })
        return { isStepValid: true, stepErrors: {} }
      }
      return { isStepValid: true, stepErrors: {} }
    } catch (validationError) {
      if (validationError instanceof Yup.ValidationError) {
        const errors: Record<string, string> = {}
        validationError.inner.forEach((err) => {
          if (err.path) {
            errors[err.path] = err.message
          }
        })
        return { isStepValid: false, stepErrors: errors }
      }
      return { isStepValid: false, stepErrors: {} }
    }
  }, [step, data])

  const handleNextStep = () => {
    if (isStepValid) {
      setSubmitError(null)
      nextStep()
    } else {
      // Show the first validation error
      const firstError = Object.values(stepErrors)[0]
      setSubmitError(
        firstError || 'Please complete all required fields before continuing'
      )
    }
  }

  const handleComplete = async () => {
    if (!isStepValid) {
      const firstError = Object.values(stepErrors)[0]
      setSubmitError(firstError || 'Please complete all required fields')
      return
    }

    try {
      setIsSubmitting(true)
      setSubmitError(null)
      await complete()
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : 'Failed to complete onboarding'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const stepIcons = [User, Activity, Target, Salad, AlertTriangle, Calculator]

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
      <StepsContent stepErrors={stepErrors} submitError={submitError} />

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
