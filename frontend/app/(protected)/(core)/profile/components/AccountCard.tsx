'use client'

import { useEffect, useState } from 'react'
import { apiWithAuth } from '@/lib/api'
import { useAppSelector, useAppDispatch } from '@/redux/hooks'
import { checkAuth } from '@/redux/api/auth'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { format } from 'date-fns'
import { Calendar } from '@/components/ui/calendar'
import { toast } from 'sonner'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { FaSave } from 'react-icons/fa'
import { ImSpinner8 } from 'react-icons/im'
import Loader from '@/components/ui/loader'

/* ------------------ Age Limits ------------------ */
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

/* ------------------ Schema ------------------ */
const FormSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(3, "First name can't be less than 3 letters")
    .max(50, "First name can't be more than 50 letters")
    .required('First name is required'),

  lastName: Yup.string()
    .min(3, "Last name can't be less than 3 letters")
    .max(50, "Last name can't be more than 50 letters")
    .required('Last name is required'),

  birth_date: Yup.date()
    .typeError('Invalid birth date')
    .min(minBirthDate, 'Age must be less than 100 years')
    .max(maxBirthDate, 'You must be at least 12 years old')
    .required('Birth date is required'),

  sex: Yup.string()
    .oneOf(['male', 'female'], 'Please select a valid sex')
    .required('Sex is required'),

  height_cm: Yup.number()
    .typeError('Height must be a number')
    .min(50, 'Height is too low')
    .max(300, 'Height is too high')
    .required('Height is required'),

  weight_kg: Yup.number()
    .typeError('Weight must be a number')
    .min(20, 'Weight is too low')
    .max(500, 'Weight is too high')
    .required('Weight is required'),

  measurement_units: Yup.string()
    .oneOf(['metric', 'imperial'])
    .required('Measurement units are required'),

  activity_level: Yup.string()
    .oneOf(['sedentary', 'light', 'moderate', 'active'])
    .required('Activity level is required'),

  goal: Yup.string()
    .oneOf(['maintenance', 'cutting', 'bulking', 'recomp'])
    .required('Goal is required'),

  dietary_preferences: Yup.string().max(500),
  allergies: Yup.string().max(500),
  medical_conditions: Yup.string().max(500),
})

/* ------------------ Component ------------------ */
export default function AccountCard() {
  const baseInput =
    'w-full rounded-lg border border-ring bg-background! px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring'

  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.auth)

  const [initialValues, setInitialValues] = useState<any>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!user) {
      dispatch(checkAuth())
    }
  }, [dispatch, user])

  useEffect(() => {
    if (user) {
      const { profile, health_data }: any = user
      setInitialValues({
        firstName: user?.first_name || '',
        lastName: user?.last_name || '',
        birth_date: profile?.birth_date ? new Date(profile.birth_date) : '',
        sex: profile?.sex || '',
        height_cm: profile?.height_cm ? String(profile.height_cm) : '',
        weight_kg: profile?.weight_kg ? String(profile.weight_kg) : '',
        measurement_units: profile?.measurement_units || 'metric',
        activity_level: profile?.activity_level || 'sedentary',
        goal: profile?.goal || '',
        dietary_preferences: health_data?.dietary_preferences?.join(', ') || '',
        allergies: health_data?.allergies?.join(', ') || '',
        medical_conditions: health_data?.medical_conditions?.join(', ') || '',
      })
    }
  }, [user])

  const handleSubmit = async (values: any) => {
    setIsSubmitting(true)
    try {
      await apiWithAuth.patch('/api/auth/users/me/', {
        first_name: values.firstName,
        last_name: values.lastName,
        profile: {
          birth_date: format(values.birth_date, 'yyyy-MM-dd'),
          sex: values.sex,
          height_cm: parseFloat(values.height_cm),
          weight_kg: parseFloat(values.weight_kg),
          measurement_units: values.measurement_units,
          activity_level: values.activity_level,
          goal: values.goal,
        },
        health_data: {
          dietary_preferences: values.dietary_preferences
            .split(',')
            .map((v: string) => v.trim())
            .filter(Boolean),
          allergies: values.allergies
            .split(',')
            .map((v: string) => v.trim())
            .filter(Boolean),
          medical_conditions: values.medical_conditions
            .split(',')
            .map((v: string) => v.trim())
            .filter(Boolean),
        },
      })

      setSuccess('Profile updated successfully')
      setError(null)
      // Update Redux user data
      dispatch(checkAuth())
      // Auto-clear success message after 5 seconds
      setTimeout(() => setSuccess(null), 5000)
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || err.message || 'Failed to update profile'
      setError(errorMessage)
      setSuccess(null)
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    if (error) {
      toast.error(error)
      setError(null)
    } else if (success) {
      toast.success(success)
      setSuccess(null)
    }
  }, [error, success])

  if (!initialValues) {
    return <Loader />
  }

  /* ------------------ JSX ------------------ */
  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize
      validationSchema={FormSchema}
      onSubmit={handleSubmit}
    >
      {({ values, setFieldValue }) => {
        const selectedBirthDate =
          values.birth_date instanceof Date
            ? values.birth_date
            : values.birth_date
            ? new Date(values.birth_date)
            : undefined

        return (
          <Form className="space-y-5">
            <h2 className="text-2xl font-bold mb-6">Account Information</h2>

            {/* First Name */}
            <div>
              <label htmlFor="firstName" className="block mb-1 font-medium">
                First Name
              </label>
              <Field
                id="firstName"
                name="firstName"
                className={baseInput}
                aria-describedby="firstName-error"
              />
              <ErrorMessage
                id="firstName-error"
                name="firstName"
                component="p"
                className="text-sm text-red-500"
              />
            </div>

            {/* Last Name */}
            <div>
              <label className="block mb-1 font-medium">Last Name</label>
              <Field name="lastName" className={baseInput} />
              <ErrorMessage
                name="lastName"
                component="p"
                className="text-sm text-red-500"
              />
            </div>

            {/* Birth Date */}
            <div>
              <label className="block mb-1 font-medium">Birth Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    id="data"
                    className={`${baseInput} hover:text-foreground  focus:ring-ring! w-full justify-start`}
                  >
                    {selectedBirthDate
                      ? format(selectedBirthDate, 'PPP')
                      : 'Pick birth date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={selectedBirthDate}
                    captionLayout="dropdown"
                    onSelect={(d) => setFieldValue('birth_date', d)}
                  />
                </PopoverContent>
              </Popover>
              <ErrorMessage
                name="birth_date"
                component="p"
                className="text-sm text-red-500"
              />
            </div>

            {/* Sex */}
            <div>
              <label className="block mb-1 font-medium">Sex</label>
              <Select
                value={values.sex}
                onValueChange={(v) => setFieldValue('sex', v)}
              >
                <SelectTrigger className={baseInput}>
                  <SelectValue placeholder="Select sex" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
              <ErrorMessage
                name="sex"
                component="p"
                className="text-sm  text-red-500"
              />
            </div>

            {/* Height / Weight */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-muted-foreground border-b pb-2">
                Physical Measurements
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 font-medium">Height (cm)</label>
                  <Field name="height_cm" type="number" className={baseInput} />
                  <ErrorMessage
                    name="height_cm"
                    component="p"
                    className="text-sm text-red-500"
                  />
                </div>

                <div>
                  <label className="block mb-1 font-medium">Weight (kg)</label>
                  <Field name="weight_kg" type="number" className={baseInput} />
                  <ErrorMessage
                    name="weight_kg"
                    component="p"
                    className="text-sm text-red-500"
                  />
                </div>
              </div>
            </div>

            {/* Fitness Goals */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-muted-foreground border-b pb-2">
                Fitness & Goals
              </h3>

              {/* Measurement Units */}
              <div>
                <label className="block mb-1 font-medium">
                  Measurement Units
                </label>
                <Select
                  value={values.measurement_units}
                  onValueChange={(v) => setFieldValue('measurement_units', v)}
                >
                  <SelectTrigger className={baseInput}>
                    <SelectValue placeholder="Measurement units" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="metric">Metric (cm/kg)</SelectItem>
                    <SelectItem value="imperial">Imperial (ft/lb)</SelectItem>
                  </SelectContent>
                </Select>
                <ErrorMessage
                  name="measurement_units"
                  component="p"
                  className="text-sm text-red-500"
                />
              </div>

              {/* Activity Level */}
              <div>
                <label className="block mb-1 font-medium">Activity Level</label>
                <Select
                  value={values.activity_level}
                  onValueChange={(v) => setFieldValue('activity_level', v)}
                >
                  <SelectTrigger className={baseInput}>
                    <SelectValue placeholder="Activity Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sedentary">Sedentary</SelectItem>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="moderate">Moderate</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                  </SelectContent>
                </Select>
                <ErrorMessage
                  name="activity_level"
                  component="p"
                  className="text-sm text-red-500"
                />
              </div>

              {/* Goal */}
              <div>
                <label className="block mb-1 font-medium">Goal</label>
                <Select
                  value={values.goal}
                  onValueChange={(v) => setFieldValue('goal', v)}
                >
                  <SelectTrigger className={baseInput}>
                    <SelectValue placeholder="Goal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="cutting">Cutting</SelectItem>
                    <SelectItem value="bulking">Bulking</SelectItem>
                    <SelectItem value="recomp">Body Recomposition</SelectItem>
                  </SelectContent>
                </Select>
                <ErrorMessage
                  name="goal"
                  component="p"
                  className="text-sm text-red-500"
                />
              </div>
            </div>

            {/* Health Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-muted-foreground border-b pb-2">
                Health Information
              </h3>

              {/* Dietary Preferences */}
              <div>
                <label className="block mb-1 font-medium">
                  Dietary Preferences (comma separated)
                </label>
                <Field name="dietary_preferences" className={baseInput} />
                <ErrorMessage
                  name="dietary_preferences"
                  component="p"
                  className="text-sm text-red-500"
                />
              </div>

              {/* Allergies */}
              <div>
                <label className="block mb-1 font-medium">
                  Allergies (comma separated)
                </label>
                <Field name="allergies" className={baseInput} />
                <ErrorMessage
                  name="allergies"
                  component="p"
                  className="text-sm text-red-500"
                />
              </div>

              {/* Medical Conditions */}
              <div>
                <label className="block mb-1 font-medium">
                  Medical Conditions (comma separated)
                </label>
                <Field name="medical_conditions" className={baseInput} />
                <ErrorMessage
                  name="medical_conditions"
                  component="p"
                  className="text-sm text-red-500"
                />
              </div>
            </div>

            {/* Submit */}
            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                className="flex-1 flex items-center justify-center"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <ImSpinner8 className="animate-spin mr-2 w-4 h-4" />
                    Saving...
                  </>
                ) : (
                  <>
                    <FaSave className="mr-2" /> Save Changes
                  </>
                )}
              </Button>
            </div>
          </Form>
        )
      }}
    </Formik>
  )
}
