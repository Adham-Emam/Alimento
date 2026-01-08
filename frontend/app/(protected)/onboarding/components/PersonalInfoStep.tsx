import { motion } from 'framer-motion'
import { ChangeEvent } from 'react'
import { cn } from '@/lib/utils'
import SelectableCard from './SelectableCard'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  currencies,
  sexOptions,
  measurementUnits,
} from '@/constants/onboarding'
import { useOnboarding } from '@/components/OnboardingProvider'

interface Props {
  stepErrors: Record<string, string | null>
  submitError: string | null
}

export default function PersonalInfoStep({ stepErrors, submitError }: Props) {
  const { data, setProfileData } = useOnboarding()

  return (
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
            stepErrors['profile.birth_date'] && 'border-destructive'
          )}
          max={new Date().toISOString().split('T')[0]}
        />
        {stepErrors['profile.birth_date'] && (
          <p className="text-sm text-destructive">
            {stepErrors['profile.birth_date']}
          </p>
        )}
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
                !data.profile.sex && submitError && 'border-destructive'
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
              onClick={() => setProfileData({ measurement_units: unit.id })}
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
            Height ({data.profile.measurement_units === 'metric' ? 'cm' : 'ft'}){' '}
            <span className="text-destructive">*</span>
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
              (!data.profile.height_cm || data.profile.height_cm <= 0) &&
                submitError &&
                'border-destructive'
            )}
            min={1}
            placeholder={
              data.profile.measurement_units === 'metric' ? '170' : '67'
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="weight">
            Weight ({data.profile.measurement_units === 'metric' ? 'kg' : 'lbs'}
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
              (!data.profile.weight_kg || data.profile.weight_kg <= 0) &&
                submitError &&
                'border-destructive'
            )}
            min={1}
            step="0.1"
            placeholder={
              data.profile.measurement_units === 'metric' ? '70' : '154'
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
              <span className="font-medium text-sm">{currency.id}</span>
            </motion.button>
          ))}
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        <span className="text-destructive">*</span> Required fields
      </p>
    </div>
  )
}
