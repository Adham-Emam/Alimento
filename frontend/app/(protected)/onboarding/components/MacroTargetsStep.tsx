'use client'

import { ChangeEvent, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Sparkles, Calculator } from 'lucide-react'
import { useOnboarding } from '@/components/OnboardingProvider'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { goals } from '@/constants/onboarding'
import { cn } from '@/lib/utils'
import { calculateMacroTargets, DEFAULT_MACRO_TARGETS } from '@/lib/onboarding'
import type { TargetMacros } from '@/types/onboarding'

interface Props {
  submitError: string | null
}

export default function MacroTargetsStep({ submitError }: Props) {
  const { data, setHealthData } = useOnboarding()

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
  const getSuggestedMacros = (): TargetMacros => {
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

  return (
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
                {goals.find((g) => g.id === data.profile.goal)?.label ||
                  'fitness'}
              </strong>{' '}
              goal, we&apos;ve calculated your optimal daily targets using the
              Mifflin-St Jeor equation.
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
                      <span className="text-sm font-bold text-card-foreground block">
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
              Daily Calories <span className="text-destructive">*</span>
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
            <span className="text-xs text-muted-foreground">kcal/day</span>
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
            <span className="text-xs text-muted-foreground">grams/day</span>
          </div>

          <div className="space-y-2">
            <Label htmlFor="carbs">
              Carbohydrates <span className="text-destructive">*</span>
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
            <span className="text-xs text-muted-foreground">grams/day</span>
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
            <span className="text-xs text-muted-foreground">grams/day</span>
          </div>
        </div>
      </div>

      {/* Current Macro Summary */}
      <div className="bg-muted/50 rounded-xl p-4">
        <h4 className="font-medium mb-3 text-foreground">Your Daily Targets</h4>
        <div className="grid grid-cols-4 gap-2 text-center">
          <div className="bg-background rounded-lg p-3">
            <span className="text-xl font-bold text-card-foreground block">
              {data.health_data.target_macros.calories || 0}
            </span>
            <span className="text-xs text-muted-foreground">Calories</span>
          </div>
          <div className="bg-background rounded-lg p-3">
            <span className="text-xl font-bold text-blue-500 block">
              {data.health_data.target_macros.protein_g || 0}g
            </span>
            <span className="text-xs text-muted-foreground">Protein</span>
          </div>
          <div className="bg-background rounded-lg p-3">
            <span className="text-xl font-bold text-amber-500 block">
              {data.health_data.target_macros.carbs_g || 0}g
            </span>
            <span className="text-xs text-muted-foreground">Carbs</span>
          </div>
          <div className="bg-background rounded-lg p-3">
            <span className="text-xl font-bold text-rose-500 block">
              {data.health_data.target_macros.fats_g || 0}g
            </span>
            <span className="text-xs text-muted-foreground">Fats</span>
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
  )
}
