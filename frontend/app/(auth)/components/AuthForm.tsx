'use client'

import { useState } from 'react'
import { Formik, Form, Field } from 'formik'
import { useSearchParams, useRouter } from 'next/navigation'
import { useAppDispatch } from '@/redux/hooks'
import { login, register } from '@/redux/api/auth'
import Link from 'next/link'
import * as Yup from 'yup'
import { Button } from '@/components/ui/button'
import { RiEyeFill, RiEyeOffFill } from 'react-icons/ri'
import { IoMdMail, IoIosLock } from 'react-icons/io'
import { ImSpinner8 } from 'react-icons/im'

interface FormDataProps {
  firstName?: string
  lastName?: string
  email: string
  password: string
  confirmPassword?: string
  agree?: boolean
  _form?: string
}

const safeNextRegex = /^\/(?!\/)[\w\-./?=#%]*$/
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/

const RegisterSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(3, "First name can't be less than 3 letters")
    .max(50, "First name can't be more than 50 letters")
    .required('First name is required'),
  lastName: Yup.string()
    .min(3, "Last name can't be less than 3 letters")
    .max(50, "Last name can't be more than 50 letters")
    .required('Last name is required'),
  email: Yup.string()
    .email('Invalid email format')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters long')
    .matches(
      passwordRegex,
      'Password must include uppercase, lowercase, number, special char (min 8 chars)'
    )
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
  agree: Yup.bool().oneOf([true], 'You must agree to the terms and conditions'),
})

const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email format')
    .required('Email is required'),
  password: Yup.string().required('Password is required'),
})

export default function AuthForm({ mode }: { mode: 'login' | 'register' }) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const dispatch = useAppDispatch()
  const searchParams = useSearchParams()
  const router = useRouter()
  const rawNext = searchParams.get('next')
  const next =
    rawNext &&
    safeNextRegex.test(rawNext) &&
    !rawNext.startsWith('/login') &&
    !rawNext.startsWith('/register') &&
    !rawNext.startsWith('/logout')
      ? rawNext
      : null

  const handleSubmit = async (
    formData: FormDataProps,
    { setSubmitting, setErrors }: any
  ) => {
    try {
      if (mode === 'register' && formData.firstName && formData.lastName) {
        await dispatch(
          register({
            first_name: formData.firstName,
            last_name: formData.lastName,
            email: formData.email,
            password: formData.password,
          })
        ).unwrap()
      } else {
        await dispatch(
          login({
            email: formData.email,
            password: formData.password,
          })
        ).unwrap()
      }
      router.replace(next || '/dashboard')
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

  const labelClasses =
    'block text-sm font-medium leading-6 text-card-foreground'
  const baseInputClasses =
    'w-full rounded-md border pr-3 py-2 pl-11 text-sm outline-none bg-input placeholder-muted-foreground transition focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50'
  const errorTextClasses = 'mt-1 text-xs text-destructive'

  return (
    <Formik
      enableReinitialize
      initialValues={
        mode === 'login'
          ? { email: '', password: '' }
          : {
              firstName: '',
              lastName: '',
              email: '',
              password: '',
              confirmPassword: '',
              agree: false,
              _form: '',
            }
      }
      validationSchema={mode === 'login' ? LoginSchema : RegisterSchema}
      onSubmit={handleSubmit}
    >
      {({ errors, touched, isSubmitting }) => (
        <Form className="flex flex-col gap-4">
          {errors._form && (
            <div className="rounded-md bg-destructive/10 text-destructive px-3 py-2 text-sm">
              {errors._form}
            </div>
          )}

          {mode === 'register' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <label className={labelClasses}>First Name</label>
                <Field
                  name="firstName"
                  disabled={isSubmitting}
                  className={`${baseInputClasses} px-3! ${
                    errors.firstName && touched.firstName
                      ? 'border-destructive focus:ring-destructive'
                      : 'border-border focus:ring-ring'
                  }`}
                />
                {errors.firstName && touched.firstName ? (
                  <p className={errorTextClasses}>{errors.firstName}</p>
                ) : null}
              </div>
              <div>
                <label className={labelClasses}>Last Name</label>
                <Field
                  name="lastName"
                  disabled={isSubmitting}
                  className={`${baseInputClasses} px-3! ${
                    errors.lastName && touched.lastName
                      ? 'border-destructive focus:ring-destructive'
                      : 'border-border focus:ring-ring'
                  }`}
                />
                {errors.lastName && touched.lastName ? (
                  <p className={errorTextClasses}>{errors.lastName}</p>
                ) : null}
              </div>
            </div>
          )}
          <div>
            <label className={labelClasses}>Email</label>
            <div className="relative">
              <IoMdMail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Field
                name="email"
                type="email"
                disabled={isSubmitting}
                className={`${baseInputClasses} ${
                  errors.email && touched.email
                    ? 'border-destructive focus:ring-destructive'
                    : 'border-border focus:ring-ring'
                }`}
              />
            </div>
            {errors.email && touched.email ? (
              <p className={errorTextClasses}>{errors.email}</p>
            ) : null}
          </div>

          <div>
            <label className={labelClasses}>Password</label>
            <div className="relative">
              <IoIosLock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Field
                name="password"
                type={showPassword ? 'text' : 'password'}
                disabled={isSubmitting}
                className={`${baseInputClasses} pr-9 ${
                  errors.password && touched.password
                    ? 'border-destructive focus:ring-destructive'
                    : 'border-border focus:ring-ring'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-2 flex items-center text-muted-foreground hover:text-header text-lg"
              >
                {showPassword ? <RiEyeOffFill /> : <RiEyeFill />}
              </button>
            </div>
            {errors.password && touched.password ? (
              <p className={errorTextClasses}>{errors.password}</p>
            ) : null}
          </div>

          {mode === 'register' && (
            <div>
              <label className={labelClasses}>Confirm password</label>
              <div className="relative">
                <IoIosLock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />

                <Field
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  disabled={isSubmitting}
                  className={`${baseInputClasses} ${
                    errors.confirmPassword && touched.confirmPassword
                      ? 'border-destructive focus:ring-destructive'
                      : 'border-border focus:ring-ring'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-2 flex items-center text-muted-foreground hover:text-header text-lg"
                >
                  {showConfirmPassword ? <RiEyeOffFill /> : <RiEyeFill />}
                </button>
              </div>
              {errors.confirmPassword && touched.confirmPassword ? (
                <p className={errorTextClasses}>{errors.confirmPassword}</p>
              ) : null}
            </div>
          )}

          {/* TERMS CHECKBOX + FORGOT */}
          <div className="flex items-center justify-between gap-2 mt-4">
            <div>
              {mode === 'register' && (
                <div className="flex items-center gap-2">
                  <Field
                    id="agree"
                    name="agree"
                    type="checkbox"
                    disabled={isSubmitting}
                    className="mt-1 h-4 w-4 rounded border-border bg-primary text-primary focus:ring-ring"
                  />
                  <div className="text-sm text-muted-foreground">
                    <label htmlFor="agree">
                      I agree to the{' '}
                      <Link href="/terms" className="underline">
                        Terms &amp; Conditions
                      </Link>
                    </label>
                    {errors.agree && touched.agree ? (
                      <p className="mt-1 text-xs text-destructive">
                        {errors.agree}
                      </p>
                    ) : null}
                  </div>
                </div>
              )}
            </div>
            {mode === 'login' && (
              <Link
                href="/reset-password"
                className="text-header/80 hover:text-header underline-offset-2 hover:underline"
              >
                Forgot password?
              </Link>
            )}
          </div>

          {/* SUBMIT */}
          <Button
            type="submit"
            className="mt-2 w-full rounded-md bg-primary text-primary-foreground font-semibold py-2.5 shadow-sm hover:brightness-95 transition duration-300"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ImSpinner8 className="animate-spin" />
            ) : mode === 'login' ? (
              'Login'
            ) : (
              'Create account'
            )}
          </Button>
        </Form>
      )}
    </Formik>
  )
}
