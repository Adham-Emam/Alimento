'use client'

import { useState, useEffect, ChangeEvent, FormEvent } from 'react'
import axios from 'axios'
import Link from 'next/link'
import { RiEyeFill, RiEyeOffFill } from 'react-icons/ri'
import { ImSpinner8 } from 'react-icons/im'
import { Button } from '@/components/ui/button'

interface LoginForm {
  email: string
  password: string
}

interface LoginFormErrors {
  email?: string | null
  password?: string | null
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const validateForm = (form: LoginForm): LoginFormErrors => {
  const errors: LoginFormErrors = {}

  if (!form.email.trim()) errors.email = 'Email or username is required'
  else if (!form.email.includes('@') && form.email.length < 3) {
    errors.email = 'Username must be at least 3 characters'
  } else if (form.email.includes('@') && !emailRegex.test(form.email)) {
    errors.email = 'Invalid email format'
  }

  if (!form.password) errors.password = 'Password is required'

  return errors
}

export default function LoginPage() {
  const [form, setForm] = useState<LoginForm>({
    email: '',
    password: '',
  })
  const [errors, setErrors] = useState<LoginFormErrors>({})
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    document.title = 'Login – Access Your Alimento Account'
  }, [])

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const updatedForm = { ...form, [name]: value }
    setForm(updatedForm)

    const validationErrors = validateForm(updatedForm)
    setErrors((prev) => ({
      ...prev,
      [name]: validationErrors[name as keyof LoginFormErrors] ?? null,
    }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const validationErrors = validateForm(form)
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length > 0) {
      console.log('Fix the errors before submitting')
      setIsLoading(false)
      return
    }

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/jwt/create/`
      )

      if (res.status !== 200) {
        alert('Error While fetching')
        return
      }
    } catch (err) {
      alert(err)
    } finally {
      setIsLoading(false)
    }
  }

  const baseInputClasses =
    'w-full rounded-md border px-3 py-2 text-sm outline-none bg-input placeholder-muted-foreground transition focus:ring-2'
  const errorTextClasses = 'mt-1 text-xs text-destructive'

  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-xl bg-card rounded-2xl shadow-lg border border-border p-8">
        <h1 className="text-2xl font-bold text-header text-center mb-2">
          Welcome back
        </h1>
        <p className="text-sm text-muted-foreground text-center mb-8">
          Login to continue your healthy journey
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* EMAIL  */}
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              name="email"
              type="text"
              value={form.email}
              onChange={handleChange}
              className={`${baseInputClasses} ${
                errors.email
                  ? 'border-destructive focus:ring-destructive'
                  : 'border-border focus:ring-ring'
              }`}
            />
            {errors.email && <p className={errorTextClasses}>{errors.email}</p>}
          </div>

          {/* PASSWORD */}
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <div className="relative">
              <input
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={handleChange}
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

          {/* REMEMBER ME + FORGOT */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-border text-primary focus:ring-ring"
              />
              <span className="text-foreground/80">Remember me</span>
            </label>
            <button
              type="button"
              className="text-header/80 hover:text-header underline-offset-2 hover:underline"
            >
              Forgot password?
            </button>
          </div>

          {/* SUBMIT */}
          <Button
            type="submit"
            className="mt-2 w-full rounded-md bg-primary text-primary-foreground font-semibold py-2.5 shadow-sm hover:brightness-95 transition"
            disabled={isLoading}
          >
            {isLoading ? <ImSpinner8 className="animate-spin" /> : 'Login'}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{' '}
          <Link
            href="/register"
            className="font-semibold text-header hover:text-header/80 underline-offset-2 hover:underline"
          >
            Create one
          </Link>
        </p>
      </div>
    </main>
  )
}
