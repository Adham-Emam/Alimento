import { useEffect, useState } from 'react'
import { apiWithAuth } from '@/lib/api'
import axios from 'axios'
import { Label } from '@/components/ui/label'
import { Form, Formik, Field } from 'formik'
import * as Yup from 'yup'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { toast } from 'sonner'
import type { CoachRequest } from '@/types'
import { useRouter } from 'next/navigation'
import { useAppSelector } from '@/redux/hooks'
import CoachRequestCard from './CoachRequestCard'
import { get } from 'http'

interface FormValues {
  title: string
  bio: string
  experience_years: number
  certifications: string
  specialization: string
  languages: string
  monthly_rate: number
  _form?: string
}

const validationSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, 'Title must be at least 3 characters long')
    .max(100, 'Title must be at most 100 characters long')
    .required('Title is required'),
  bio: Yup.string()
    .min(50, 'Bio must be at least 50 characters long')
    .max(5000, 'Bio must be at most 5000 characters long')
    .required('Bio is required'),
  experience_years: Yup.number()
    .min(0, 'Experience years must be at least 0')
    .max(100, 'Experience years must be at most 100')
    .required('Experience years is required'),
  certifications: Yup.string().required('Certifications are required'),
  specialization: Yup.string().required('Specialization is required'),
  languages: Yup.string().required('Languages are required'),
  monthly_rate: Yup.number()
    .min(1, 'Monthly rate must be at least 1')
    .required('Monthly rate is required'),
})

export default function CoachRequests() {
  const [coachRequest, setCoachRequest] = useState<CoachRequest | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAppSelector((state) => state.auth)
  const router = useRouter()

  const getCoachRequests = async () => {
    try {
      const res = await apiWithAuth.get<CoachRequest>(
        '/api/coaches/requests/me/'
      )

      setCoachRequest(res.data)
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 404) {
          setError('No coach requests found')
          return
        }

        const message =
          err.response?.data?.detail ||
          err.response?.data?.message ||
          'Failed to load coach request'

        setError(message)
      } else {
        setError('Unexpected error occurred')
      }
    }
  }

  const normalizeArray = (value: string) =>
    value
      .split(',')
      .map((v) => v.trim())
      .filter(Boolean)

  const handleSubmit = async (
    formData: FormValues,
    { setSubmitting, setErrors }: any
  ) => {
    if (!user?.subscription.is_coach) {
      toast.error('You must be on a coach plan to submit a request')
      router.replace('/plans')
    }

    try {
      const payload = {
        ...formData,
        certifications: normalizeArray(formData.certifications as any),
        specialization: normalizeArray(formData.specialization as any),
        languages: normalizeArray(formData.languages as any),
      }

      await apiWithAuth.post<CoachRequest>('/api/coaches/requests/', payload)

      await getCoachRequests()
      setSuccess('Coach request sent successfully!')
    } catch (err: any) {
      // Thunk rejectWithValue
      if (typeof err === 'string') {
        setErrors({ _form: err })
        return
      }

      if (err.response?.data) {
        const data = err.response.data

        if (data.non_field_errors) {
          setErrors({ _form: data.non_field_errors[0] })
          return
        }

        //  Global error
        if (typeof data.detail === 'string') {
          setErrors({ _form: data.detail })
          return
        }

        // Field-level errors
        const apiErrors: Record<string, string> = {}
        Object.entries(data).forEach(([key, value]: any) => {
          apiErrors[key] = Array.isArray(value) ? value[0] : value
        })

        setErrors(apiErrors)
      }
    } finally {
      setSubmitting(false)
    }
  }

  useEffect(() => {
    getCoachRequests()
  }, [])

  useEffect(() => {
    if (error) {
      toast.error(error)
      setError(null)
    }
    if (success) {
      toast.success(success)
      setSuccess(null)
    }
  }, [error, success])

  const labelClasses =
    'block text-sm font-medium leading-6 text-card-foreground'
  const baseInputClasses =
    'w-full rounded-md border px-3 py-2 text-sm outline-none bg-card placeholder-muted-foreground transition focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50'
  const errorTextClasses = 'mt-1 text-xs text-destructive'

  return (
    <Accordion
      type="single"
      collapsible
      className="rounded-2xl px-6 mb-4 bg-foreground/10 dark:bg-accent-foreground/20"
    >
      <AccordionItem value="item-1 ">
        <AccordionTrigger className="flex items-center text-lg font-semibold cursor-pointer">
          Coach Requests
        </AccordionTrigger>
        <AccordionContent>
          {coachRequest ? (
            <CoachRequestCard
              coachRequest={coachRequest}
              setCoachRequest={setCoachRequest}
            />
          ) : (
            <Formik
              initialValues={{
                title: '',
                bio: '',
                experience_years: 0,
                certifications: '',
                specialization: '',
                languages: '',
                monthly_rate: 0,
                _form: '',
              }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ errors, touched, isSubmitting }) => (
                <Form className="flex flex-col gap-4">
                  {errors._form && (
                    <div className="rounded-md bg-destructive/10 text-destructive px-3 py-2 text-sm">
                      {errors._form}
                    </div>
                  )}

                  <div>
                    <Label className={labelClasses}>Title</Label>
                    <Field
                      name="title"
                      disabled={isSubmitting}
                      placeholder="e.g. Certified Personal Trainer"
                      className={`${baseInputClasses} ${
                        errors.title && touched.title
                          ? 'border-destructive focus:ring-destructive'
                          : 'border-border focus:ring-ring'
                      }`}
                    />
                    {errors.title && touched.title ? (
                      <p className={errorTextClasses}>{errors.title}</p>
                    ) : null}
                  </div>
                  <div>
                    <Label className={labelClasses}>Bio</Label>
                    <Field
                      as={Textarea}
                      name="bio"
                      disabled={isSubmitting}
                      placeholder="e.g. I have experience in personal training and have a passion for helping people reach their fitness goals."
                      className={`${baseInputClasses} max-w-full wrap-break-word whitespace-pre-wrap  ${
                        errors.bio && touched.bio
                          ? 'border-destructive focus:ring-destructive'
                          : 'border-border focus:ring-ring'
                      }`}
                    />
                    {errors.bio && touched.bio ? (
                      <p className={errorTextClasses}>{errors.bio}</p>
                    ) : null}
                  </div>
                  <div>
                    <Label className={labelClasses}>Experience Years</Label>
                    <Field
                      name="experience_years"
                      disabled={isSubmitting}
                      type="number"
                      className={`${baseInputClasses} ${
                        errors.experience_years && touched.experience_years
                          ? 'border-destructive focus:ring-destructive'
                          : 'border-border focus:ring-ring'
                      }`}
                    />
                    {errors.experience_years && touched.experience_years ? (
                      <p className={errorTextClasses}>
                        {errors.experience_years}
                      </p>
                    ) : null}
                  </div>
                  <div>
                    <Label className={labelClasses}>
                      Certifications (Comma Separated)
                    </Label>
                    <Field
                      name="certifications"
                      disabled={isSubmitting}
                      placeholder="e.g. Certificate of Personal Training, Certified Personal Trainer"
                      className={`${baseInputClasses} ${
                        errors.certifications && touched.certifications
                          ? 'border-destructive focus:ring-destructive'
                          : 'border-border focus:ring-ring'
                      }`}
                    />
                    {errors.certifications && touched.certifications ? (
                      <p className={errorTextClasses}>
                        {errors.certifications}
                      </p>
                    ) : null}
                  </div>
                  <div>
                    <Label className={labelClasses}>
                      Specialization (Comma Separated)
                    </Label>
                    <Field
                      name="specialization"
                      disabled={isSubmitting}
                      placeholder="e.g. Fitness, Strength Training, Nutrition"
                      className={`${baseInputClasses} ${
                        errors.specialization && touched.specialization
                          ? 'border-destructive focus:ring-destructive'
                          : 'border-border focus:ring-ring'
                      }`}
                    />
                    {errors.specialization && touched.specialization ? (
                      <p className={errorTextClasses}>
                        {errors.specialization}
                      </p>
                    ) : null}
                  </div>
                  <div>
                    <Label className={labelClasses}>
                      Languages (Comma Separated)
                    </Label>
                    <Field
                      name="languages"
                      disabled={isSubmitting}
                      placeholder="e.g. English, French, Spanish"
                      className={`${baseInputClasses} ${
                        errors.languages && touched.languages
                          ? 'border-destructive focus:ring-destructive'
                          : 'border-border focus:ring-ring'
                      }`}
                    />
                    {errors.languages && touched.languages ? (
                      <p className={errorTextClasses}>{errors.languages}</p>
                    ) : null}
                  </div>
                  <div>
                    <Label className={labelClasses}>Monthly Rate</Label>
                    <Field
                      name="monthly_rate"
                      type="number"
                      disabled={isSubmitting}
                      className={`${baseInputClasses} ${
                        errors.monthly_rate && touched.monthly_rate
                          ? 'border-destructive focus:ring-destructive'
                          : 'border-border focus:ring-ring'
                      }`}
                    />
                    {errors.monthly_rate && touched.monthly_rate ? (
                      <p className={errorTextClasses}>{errors.monthly_rate}</p>
                    ) : null}
                  </div>

                  <Button type="submit">Create Request</Button>
                </Form>
              )}
            </Formik>
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
