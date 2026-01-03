'use client'
import { useState, ChangeEvent, FormEvent } from 'react'
import { api } from '@/lib/api'
import { Button } from '../ui/button'

const SubscribeForm = () => {
  const [email, setEmail] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>('')

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (email.trim() === '') {
      setError('Email is required')
      return
    } else if (emailRegex.test(email)) {
      setError('Invalid Email')
    }

    setIsLoading(true)
    setError(null)

    try {
      await api.post('/api/blog/subscribe/', { email })
      setEmail('')
    } catch (err: any) {
      console.error(err)
      setError(err?.response?.data?.detail || 'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="flex justify-between items-center border border-ring rounded-2xl overflow-hidden p-2 bg-background gap-4 w-full"
      >
        <input
          type="email"
          name="email"
          placeholder="Enter your email..."
          className="w-full outline-none bg-transparent disabled:opacity-60"
          value={email}
          disabled={isLoading}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setEmail(e.target.value)
          }
        />
        <Button
          type="submit"
          className="rounded-full border-ring"
          disabled={isLoading}
        >
          {isLoading ? 'Subscribing…' : 'Subscribe'}
        </Button>
      </form>
      {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
    </>
  )
}

export default SubscribeForm
