'use client'
import { useState, useEffect } from 'react'
import { apiWithAuth } from '@/lib/api'
import { format } from 'date-fns'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { FaSave } from 'react-icons/fa'

export default function AccountCard({ user }: any) {
  const baseInputClasses =
    'w-full rounded-lg border border-ring bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring'
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    birth_date: '',
    sex: '',
    height_cm: '',
    weight_kg: '',
    measurement_units: 'metric',
    activity_level: 'sedentary',
    goal: '',
    dietary_preferences: '',
    allergies: '',
    medical_conditions: '',
  })
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const MAX = {
    height_cm: 300,
    weight_kg: 500,
  }

  const VALID_VALUES = {
    sex: ['male', 'female'],
    measurement_units: ['metric', 'imperial'],
    activity_level: ['sedentary', 'light', 'moderate', 'active'],
    goal: ['maintenance', 'cutting', 'bulking', 'recomp'],
  }

  const handleFieldChange = (name: string, value: any) => {
    let nextValue = value

    /* -------------------- Dates -------------------- */
    if (value instanceof Date) {
      const today = new Date()
      if (value > today) return

      nextValue = format(value, 'yyyy-MM-dd')
    }

    /* -------------------- Strings -------------------- */
    if (typeof value === 'string') {
      if (
        (name === 'first_name' || name === 'last_name') &&
        value.length > 150
      ) {
        return
      }

      nextValue = value
    }

    /* -------------------- Numbers -------------------- */
    if (['height_cm', 'weight_kg'].includes(name)) {
      const num = Number(value)

      if (isNaN(num)) return

      nextValue = Math.min(
        Math.max(num, 0),
        MAX[name as 'height_cm' | 'weight_kg']
      )
    }

    /* -------------------- Select Values -------------------- */
    if (name in VALID_VALUES) {
      if (!VALID_VALUES[name as keyof typeof VALID_VALUES].includes(value)) {
        return
      }
    }

    setFormData((prev) => ({
      ...prev,
      [name]: nextValue,
    }))
  }

  const getUserData = async () => {
    try {
      const res = await apiWithAuth.get('/api/auth/users/me')

      const data: any = res.data
      const { profile, health_data }: any = data

      setFormData({
        first_name: data.first_name ?? '',
        last_name: data.last_name ?? '',
        birth_date: profile?.birth_date ?? '',
        sex: profile?.sex ?? '',
        height_cm: profile?.height_cm?.toString() ?? '',
        weight_kg: profile?.weight_kg?.toString() ?? '',
        measurement_units: profile?.measurement_units ?? 'metric',
        activity_level: profile?.activity_level ?? 'sedentary',
        goal: profile?.goal ?? '',
        dietary_preferences: health_data?.dietary_preferences?.join(', ') ?? '',
        allergies: health_data?.allergies?.join(', ') ?? '',
        medical_conditions: health_data?.medical_conditions?.join(', ') ?? '',
      })
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to load profile data')
      console.error(err)
    }
  }

  useEffect(() => {
    getUserData()
  }, [])

  const handleSubmit = async (e: any) => {
    e.preventDefault()

    const payload = {
      first_name: formData.first_name || null,
      last_name: formData.last_name || null,
      profile: {
        birth_date: formData.birth_date || null,
        sex: formData.sex || null,
        height_cm: formData.height_cm ? Number(formData.height_cm) : null,
        weight_kg: formData.weight_kg ? Number(formData.weight_kg) : null,
        measurement_units: formData.measurement_units,
        activity_level: formData.activity_level,
        goal: formData.goal || null,
      },
      health_data: {
        dietary_preferences: formData.dietary_preferences
          .split(',')
          .map((v) => v.trim())
          .filter(Boolean),
        allergies: formData.allergies
          .split(',')
          .map((v) => v.trim())
          .filter(Boolean),
        medical_conditions: formData.medical_conditions
          .split(',')
          .map((v) => v.trim())
          .filter(Boolean),
      },
    }

    try {
      await apiWithAuth.put('/api/auth/users/me/', payload)
      getUserData()
      setError(null)
      setSuccess('Profile updated successfully')
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to update profile data')
      console.error(err)
      setSuccess(null)
    }
  }

  const selectedBirthDate = formData.birth_date
    ? new Date(formData.birth_date)
    : undefined

  return (
    <>
      <h2 className="mb-8 text-2xl font-bold">Account</h2>

      {success && (
        <div className="bg-ring/50 text-header border border-ring rounded-lg p-4 mb-8 shadow-lg">
          <span>{success}</span>
        </div>
      )}
      {error && (
        <div className="bg-destructive/20 text-destructive border border-destructive rounded-lg p-4 mb-8 shadow-lg">
          <span>{error}</span>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* First Name */}
        <div>
          <label className="mb-1 block font-medium">First Name</label>
          <input
            className={baseInputClasses}
            value={formData.first_name}
            onChange={(e) => handleFieldChange('first_name', e.target.value)}
          />
        </div>

        {/* Last Name */}
        <div>
          <label className="mb-1 block font-medium">Last Name</label>
          <input
            className={baseInputClasses}
            value={formData.last_name}
            onChange={(e) => handleFieldChange('last_name', e.target.value)}
          />
        </div>

        {/* Email */}
        <div>
          <label className="mb-1 block font-medium">Email</label>
          <input
            value={user.email}
            disabled
            className={`${baseInputClasses} cursor-not-allowed opacity-70`}
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {/* Birth Date */}
          <div>
            <label className="mb-1 block font-medium">Birth Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  id="date"
                  className={`${baseInputClasses} hover:bg-background w-full justify-start text-left font-normal`}
                >
                  {formData.birth_date
                    ? format(selectedBirthDate!, 'PPP')
                    : 'Pick a date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                align="start"
                className="w-auto overflow-hidden p-0"
              >
                <Calendar
                  mode="single"
                  selected={selectedBirthDate}
                  captionLayout="dropdown"
                  onSelect={(selected) => {
                    if (selected) {
                      handleFieldChange('birth_date', selected)
                    }
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Sex */}
          <div>
            <label className="mb-1 block font-medium">Sex</label>
            <Select
              value={formData.sex}
              onValueChange={(value) => handleFieldChange('sex', value)}
            >
              <SelectTrigger className={baseInputClasses}>
                <SelectValue placeholder="Select your sex" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Measurement Units */}
        <div>
          <label className="mb-1 block font-medium">Measurement Units</label>
          <Select
            value={formData.measurement_units}
            onValueChange={(value) =>
              handleFieldChange('measurement_units', value)
            }
          >
            <SelectTrigger className={baseInputClasses}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="metric">Metric (m/kg)</SelectItem>
              <SelectItem value="imperial">Imperial (ft/lb)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Height / Weight */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block font-medium">
              Height {formData.measurement_units === 'metric' ? '(cm)' : '(ft)'}
            </label>
            <input
              type="number"
              className={baseInputClasses}
              value={formData.height_cm}
              onChange={(e) => handleFieldChange('height_cm', e.target.value)}
            />
          </div>
          <div>
            <label className="mb-1 block font-medium">
              Weight {formData.measurement_units === 'metric' ? '(kg)' : '(lb)'}
            </label>
            <input
              type="number"
              className={baseInputClasses}
              value={formData.weight_kg}
              onChange={(e) => handleFieldChange('weight_kg', e.target.value)}
            />
          </div>
        </div>

        {/* Activity Level */}
        <div>
          <label className="mb-1 block font-medium">Activity Level</label>
          <Select
            value={formData.activity_level}
            onValueChange={(value) =>
              handleFieldChange('activity_level', value)
            }
          >
            <SelectTrigger className={baseInputClasses}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sedentary">Sedentary</SelectItem>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="moderate">Moderate</SelectItem>
              <SelectItem value="active">Active</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Goal */}
        <div>
          <label className="mb-1 block font-medium">Goal</label>
          <Select
            value={formData.goal}
            onValueChange={(value) => handleFieldChange('goal', value)}
          >
            <SelectTrigger className={baseInputClasses}>
              <SelectValue placeholder="Select goal" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="maintenance">Maintenance</SelectItem>
              <SelectItem value="cutting">Cutting</SelectItem>
              <SelectItem value="bulking">Bulking</SelectItem>
              <SelectItem value="recomp">Body Recomposition</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Health Data */}
        <div>
          <label className="mb-1 block font-medium">
            Dietary Preferences (comma separated)
          </label>
          <input
            className={baseInputClasses}
            value={formData.dietary_preferences}
            onChange={(e) =>
              handleFieldChange('dietary_preferences', e.target.value)
            }
          />
        </div>

        <div>
          <label className="mb-1 block font-medium">
            Allergies (comma separated)
          </label>
          <input
            className={baseInputClasses}
            value={formData.allergies}
            onChange={(e) => handleFieldChange('allergies', e.target.value)}
          />
        </div>

        <div>
          <label className="mb-1 block font-medium">
            Medical Conditions (comma separated)
          </label>
          <input
            className={baseInputClasses}
            value={formData.medical_conditions}
            onChange={(e) =>
              handleFieldChange('medical_conditions', e.target.value)
            }
          />
        </div>

        <Button type="submit" className="w-full text-foreground">
          <FaSave className="w-8 h-8" />
          Save Changes
        </Button>
      </form>
    </>
  )
}
