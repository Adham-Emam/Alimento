'use client'

import { useState, useEffect, FormEvent, ChangeEvent } from 'react'
import Link from 'next/link'
import { RiEyeLine, RiEyeOffLine } from 'react-icons/ri'

type RegisterForm = {
  fullName: string
  email: string
  password: string
  confirmPassword: string
  agree: boolean
}

type RegisterFormErrors = {
  fullName?: string | null
  email?: string | null
  password?: string | null
  confirmPassword?: string | null
  agree?: string | null
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/

export default function RegisterPage() {
  const [form, setForm] = useState<RegisterForm>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agree: false,
  })

  const [errors, setErrors] = useState<RegisterFormErrors>({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  useEffect(() => {
    document.title = 'Register | Alimento'
  }, [])

  const validateForm = (currentForm: RegisterForm): RegisterFormErrors => {
    const newErrors: RegisterFormErrors = {}

    if (!currentForm.fullName.trim()) {
      newErrors.fullName = 'Full name is required'
    }

    if (!currentForm.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!emailRegex.test(currentForm.email)) {
      newErrors.email = 'Invalid email format'
    }

    if (!currentForm.password) {
      newErrors.password = 'Password is required'
    } else if (!passwordRegex.test(currentForm.password)) {
      newErrors.password =
        'Password must include uppercase, lowercase, number, special char (min 8 chars)'
    }

    if (!currentForm.confirmPassword) {
      newErrors.confirmPassword = 'Confirm password is required'
    } else if (currentForm.confirmPassword !== currentForm.password) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    if (!currentForm.agree) {
      newErrors.agree = 'You must agree to the Terms & Conditions'
    }

    return newErrors
  }

  const handleChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const { id, type, checked, value } = e.target

    const updatedForm: RegisterForm = {
      ...form,
      [id]: type === 'checkbox' ? checked : value,
    } as RegisterForm

    setForm(updatedForm)

    const allErrors = validateForm(updatedForm)
    const singleError = (allErrors as any)[id] || null

    setErrors(prev => ({
      ...prev,
      [id]: singleError,
    }))
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    const validationErrors = validateForm(form)
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length > 0) {
      console.log('Fix the errors before submitting')
      return
    }

    alert('Form Submitted Successfully!')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-xl bg-card border border-border rounded-2xl shadow-lg p-8">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold mb-2">Create your account</h1>
          <p className="text-sm text-muted-foreground">
            Join Alimento and start your healthy journey
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* FULL NAME */}
          <div>
            <label
              htmlFor="fullName"
              className="block text-sm font-medium mb-1"
            >
              Full name
            </label>
            <input
              id="fullName"
              type="text"
              value={form.fullName}
              onChange={handleChange}
              className={`w-full rounded-md border bg-input px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-ring focus:border-ring ${
                errors.fullName ? 'border-destructive' : 'border-border'
              }`}
            />
            {errors.fullName && (
              <p className="mt-1 text-xs text-destructive">
                {errors.fullName}
              </p>
            )}
          </div>

          {/* EMAIL */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium mb-1"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className={`w-full rounded-md border bg-input px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-ring focus:border-ring ${
                errors.email ? 'border-destructive' : 'border-border'
              }`}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-destructive">
                {errors.email}
              </p>
            )}
          </div>

          {/* PASSWORD */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-1"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={handleChange}
                className={`w-full rounded-md border bg-input px-4 py-3 pr-10 text-sm outline-none transition focus:ring-2 focus:ring-ring focus:border-ring ${
                  errors.password ? 'border-destructive' : 'border-border'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(prev => !prev)}
                className="absolute inset-y-0 right-3 flex items-center text-muted-foreground text-lg"
              >
                {showPassword ? <RiEyeOffLine /> : <RiEyeLine />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-xs text-destructive">
                {errors.password}
              </p>
            )}
          </div>

          {/* CONFIRM PASSWORD */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium mb-1"
            >
              Confirm password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={form.confirmPassword}
                onChange={handleChange}
                className={`w-full rounded-md border bg-input px-4 py-3 pr-10 text-sm outline-none transition focus:ring-2 focus:ring-ring focus:border-ring ${
                  errors.confirmPassword
                    ? 'border-destructive'
                    : 'border-border'
                }`}
              />
              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(prev => !prev)
                }
                className="absolute inset-y-0 right-3 flex items-center text-muted-foreground text-lg"
              >
                {showConfirmPassword ? (
                  <RiEyeOffLine />
                ) : (
                  <RiEyeLine />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-xs text-destructive">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* TERMS CHECKBOX */}
          <div className="flex items-start gap-2">
            <input
              id="agree"
              type="checkbox"
              checked={form.agree}
              onChange={handleChange}
              className="mt-1 h-4 w-4 rounded border-border bg-input text-primary focus:ring-ring"
            />
            <div className="text-xs text-muted-foreground">
              <label htmlFor="agree">
                I agree to the{' '}
                <span className="underline">
                  Terms &amp; Conditions
                </span>
              </label>
              {errors.agree && (
                <p className="mt-1 text-xs text-destructive">
                  {errors.agree}
                </p>
              )}
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            className="mt-2 w-full rounded-md bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-90 transition"
          >
            Create account
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link
            href="/login"
            className="font-semibold text-foreground underline-offset-2 hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  )
}
