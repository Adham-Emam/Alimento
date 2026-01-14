'use client'

import { toast } from 'sonner'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { apiWithAuth } from '@/lib/api'
import type { UserProps } from '@/types'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CalendarDays } from 'lucide-react'
import { format } from 'date-fns'
import axios from 'axios'
import SkeletonComponent from '@/components/layout/SkeletonComponent'
import { useRouter } from 'next/navigation'

interface Props {
  coachId: number
}

export default function CoachComponent({ coachId }: Props) {
  const [user, setUser] = useState<UserProps | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const getCoach = async () => {
    setError(null)
    setIsLoading(true)
    try {
      const res = await apiWithAuth.get<UserProps>(
        `/api/auth/users/${coachId}/`
      )
      setUser(res.data)
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.detail || 'Failed to load coach')
      } else {
        setError('Unexpected error occurred')
      }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getCoach()
  }, [coachId])

  useEffect(() => {
    if (error) {
      toast.error(error)
      setError(null)
    }
  }, [error])

  useEffect(() => {
    if (!isLoading && user && !user?.subscription?.is_coach) {
      router.replace('/404')
    }
  }, [user, isLoading, router])

  if (isLoading || !user) {
    return <SkeletonComponent />
  }
  const coach = user.coach_profile

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold">{coach.title}</h1>
          <p className="text-muted-foreground font-semibold mt-1">
            {coach.experience_years} years of experience
          </p>
        </div>

        <div className="text-2xl font-semibold">
          ${coach.monthly_rate}
          <span className="text-sm text-muted-foreground"> / month</span>
        </div>
      </div>

      {/* Bio */}
      <section className="bg-card border rounded-xl p-6">
        <h2 className="font-semibold text-lg mb-3">About</h2>
        <p className="leading-relaxed text-muted-foreground">{coach.bio}</p>
      </section>

      {/* Specialization */}
      <section className="bg-card border rounded-xl p-6">
        <h2 className="font-semibold text-lg mb-4">Specializations</h2>
        <div className="flex flex-wrap gap-2">
          {coach.specialization &&
            coach.specialization.map((item, index) => (
              <Badge key={index} variant="secondary">
                {item}
              </Badge>
            ))}
        </div>
      </section>

      {/* Certifications */}
      <section className="bg-card border rounded-xl p-6">
        <h2 className="font-semibold text-lg mb-4">Certifications</h2>
        <ul className="list-disc list-inside text-muted-foreground space-y-1">
          {coach.certifications &&
            coach.certifications.map((cert, index) => (
              <li key={index}>{cert}</li>
            ))}
        </ul>
      </section>

      {/* Languages */}
      <section className="bg-card border rounded-xl p-6">
        <h2 className="font-semibold text-lg mb-4">Languages</h2>
        <div className="flex flex-wrap gap-2">
          {coach.languages &&
            coach.languages.map((lang, index) => (
              <Badge key={index} variant="default">
                {lang}
              </Badge>
            ))}
        </div>
      </section>

      {/* Footer */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-6 border-t">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <CalendarDays size={16} />
          Joined {format(new Date(coach.created_at), 'MMMM yyyy')}
        </div>

        {coach.contact_link && (
          <Button size="lg" asChild>
            <Link href={coach.contact_link}>Contact Coach</Link>
          </Button>
        )}
      </div>
    </div>
  )
}
