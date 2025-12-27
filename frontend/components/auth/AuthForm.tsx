// components/AuthForm.tsx

'use client'

import { useState, useEffect, ChangeEvent, FormEvent } from 'react'
import { useSearchParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { RiEyeFill, RiEyeOffFill } from 'react-icons/ri'
import { IoMdMail, IoIosLock } from 'react-icons/io'
import { ImSpinner8 } from 'react-icons/im'
import { Button } from '@/components/ui/button'
import { useOnboarding } from '@/contexts/OnboardingContext'
import Link from 'next/link'

interface FormDataProps {
  firstName?: string
  lastName?: string
  email: string
  password: string
  confirmPassword?: string
  agree?: boolean
}

interface FormErrorsProps {
  form?: string | null
  firstName?: string | null
  lastName?: string | null
  email?: string | null
  password?: string | null
  confirmPassword?: string | null
  agree?: string | null
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/
const safeNextRegex = /^\/(?!\/)[\w\-./?=#%]*$/

const AuthForm = ({ mode }: { mode: 'login' | 'register' }) => {
  const [formData, setFormData] = useState<FormDataProps>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agree: false,
  })
  const [errors, setErrors] = useState<FormErrorsProps>({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isPageLoading, setIsPageLoading] = useState(false)

  const { isAuthenticated, isLoading: authLoading, login, register } = useAuth()
  const { isLoading: onboardingLoading, isComplete } = useOnboarding()
  const searchParams = useSearchParams()
  const rawNext = searchParams.get('next')
  const next = rawNext && safeNextRegex.test(rawNext) ? rawNext : null

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      if (!isComplete) {
        window.location.href = '/onboarding'
        return
      }
      window.location.href = next || '/dashboard'
    }
  }, [isAuthenticated, authLoading, isComplete, onboardingLoading, next])

  useEffect(() => {
    document.title =
      mode === 'login'
        ? 'Login – Access Your Aliménto Account'
        : 'Create an Account – Join Aliménto'
  }, [mode])

  const validateForm = (form: FormDataProps): FormErrorsProps => {
    const errors: FormErrorsProps = {}

    if (!form.email.trim()) errors.email = 'Email is required'
    else if (!emailRegex.test(form.email)) {
      errors.email = 'Invalid email format'
    }

    if (!form.password) errors.password = 'Password is required'

    if (mode === 'register') {
      if (!form.firstName?.trim()) {
        errors.firstName = 'First name is required'
      } else if (form.firstName?.length < 3) {
        errors.firstName = "First name can't be less than 3 letters"
      }

      if (!form.lastName?.trim()) {
        errors.lastName = 'Last name is required'
      } else if (form.lastName?.length < 3) {
        errors.lastName = "Last name can't be less than 3 letters"
      }

      if (!passwordRegex.test(form.password)) {
        errors.password =
          'Password must include uppercase, lowercase, number, special char (min 8 chars)'
      }

      if (!form.confirmPassword) {
        errors.confirmPassword = 'Confirm password is required'
      } else if (form.confirmPassword !== form.password) {
        errors.confirmPassword = 'Passwords do not match'
      }

      if (!form.agree) {
        errors.agree = 'You must agree to the Terms & Conditions'
      }
    }

    return errors
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, type, checked, value } = e.target
    const updatedValue = type === 'checkbox' ? checked : value

    const updatedForm: FormDataProps = {
      ...formData,
      [name]: updatedValue,
    }
    setFormData(updatedForm)

    const validationErrors = validateForm(updatedForm)
    const singleError = validationErrors[name as keyof FormDataProps] ?? null

    setErrors((prev) => ({
      ...prev,
      [name]: singleError,
      form: null, // Clear form error on any change
    }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setErrors({})

    const validationErrors = validateForm(formData)

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setIsPageLoading(true)

    try {
      if (mode === 'register') {
        await register({
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          password: formData.password,
        })
      } else {
        await login({
          email: formData.email,
          password: formData.password,
        })
      }

      if (!isComplete) {
        window.location.href = '/onboarding'
        return
      }
      window.location.href = next || '/dashboard'
    } catch (err: any) {
      console.error('Auth error:', err)

      // Handle different error formats
      let errorMessage = 'Authentication failed. Please try again.'

      if (err.response?.data) {
        const data = err.response.data

        if (typeof data === 'string') {
          errorMessage = data
        } else if (data.detail) {
          errorMessage = data.detail
        } else if (data.non_field_errors) {
          errorMessage = data.non_field_errors[0]
        } else if (data.email) {
          errorMessage = `Email: ${data.email[0]}`
        } else if (data.password) {
          errorMessage = `Password: ${data.password[0]}`
        }
      } else if (err.message) {
        errorMessage = err.message
      }

      setErrors({ form: errorMessage })
      setIsPageLoading(false)
    }
  }

  const baseInputClasses =
    'w-full rounded-md border pr-3 py-2 pl-11 text-sm outline-none bg-input placeholder-muted-foreground transition focus:ring-2'
  const errorTextClasses = 'mt-1 text-xs text-destructive'

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Form Error Display */}
      {errors.form && (
        <div className="p-3 rounded-md bg-destructive/10 border border-destructive text-destructive text-sm">
          {errors.form}
        </div>
      )}

      {mode === 'register' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* FIRST NAME */}
          <div className="w-full flex-1">
            <label
              htmlFor="firstName"
              className="block text-sm font-medium mb-1"
            >
              First name
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              value={formData.firstName}
              onChange={handleChange}
              disabled={isPageLoading}
              className={`${baseInputClasses} px-3! ${
                errors.firstName
                  ? 'border-destructive focus:ring-destructive'
                  : 'border-border focus:ring-ring'
              }`}
            />
            {errors.firstName && (
              <p className={errorTextClasses}>{errors.firstName}</p>
            )}
          </div>

          {/* LAST NAME */}
          <div className="w-full flex-1">
            <label
              htmlFor="lastName"
              className="block text-sm font-medium mb-1"
            >
              Last name
            </label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              value={formData.lastName}
              onChange={handleChange}
              disabled={isPageLoading}
              className={`${baseInputClasses} px-3! ${
                errors.lastName
                  ? 'border-destructive focus:ring-destructive'
                  : 'border-border focus:ring-ring'
              }`}
            />
            {errors.lastName && (
              <p className={errorTextClasses}>{errors.lastName}</p>
            )}
          </div>
        </div>
      )}

      {/* EMAIL */}
      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-medium mb-1">
          Email
        </label>
        <div className="relative">
          <IoMdMail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            id="email"
            name="email"
            type="text"
            value={formData.email}
            onChange={handleChange}
            disabled={isPageLoading}
            className={`${baseInputClasses} ${
              errors.email
                ? 'border-destructive focus:ring-destructive'
                : 'border-border focus:ring-ring'
            }`}
          />
        </div>
        {errors.email && <p className={errorTextClasses}>{errors.email}</p>}
      </div>

      {/* PASSWORD */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium mb-1">
          Password
        </label>
        <div className="relative">
          <IoIosLock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handleChange}
            disabled={isPageLoading}
            className={`${baseInputClasses} pr-9 ${
              errors.password
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
        {errors.password && (
          <p className={errorTextClasses}>{errors.password}</p>
        )}
      </div>

      {/* CONFIRM PASSWORD */}
      {mode === 'register' && (
        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium mb-1"
          >
            Confirm password
          </label>
          <div className="relative">
            <IoIosLock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />

            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={isPageLoading}
              className={`${baseInputClasses} ${
                errors.confirmPassword
                  ? 'border-destructive focus:ring-destructive'
                  : 'border-border focus:ring-ring'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute inset-y-0 right-3 flex items-center text-muted-foreground text-lg"
            >
              {showConfirmPassword ? <RiEyeOffFill /> : <RiEyeFill />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className={errorTextClasses}>{errors.confirmPassword}</p>
          )}
        </div>
      )}

      {/* TERMS CHECKBOX + FORGOT */}
      <div className="flex items-center justify-between text-sm">
        <div>
          {mode === 'register' && (
            <div className="flex items-center gap-2">
              <input
                id="agree"
                name="agree"
                type="checkbox"
                checked={formData.agree}
                onChange={handleChange}
                disabled={isPageLoading}
                className="mt-1 h-4 w-4 rounded border-border bg-input text-primary focus:ring-ring"
              />
              <div className="text-xs text-muted-foreground">
                <label htmlFor="agree">
                  I agree to the{' '}
                  <Link href="/terms" className="underline">
                    Terms &amp; Conditions
                  </Link>
                </label>
                {errors.agree && (
                  <p className="mt-1 text-xs text-destructive">
                    {errors.agree}
                  </p>
                )}
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
        disabled={isPageLoading}
      >
        {isPageLoading ? (
          <ImSpinner8 className="animate-spin" />
        ) : mode === 'login' ? (
          'Login'
        ) : (
          'Create account'
        )}
      </Button>
    </form>
  )
}

export default AuthForm
