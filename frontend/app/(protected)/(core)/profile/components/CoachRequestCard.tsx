'use client'

import axios from 'axios'
import { useEffect, useState } from 'react'
import type { CoachRequest } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import { apiWithAuth } from '@/lib/api'
import { toast } from 'sonner'

function normalize(value: string[] | string) {
  if (Array.isArray(value)) return value
  return value
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean)
}

export default function CoachRequestCard({
  coachRequest,
  setCoachRequest,
}: {
  coachRequest: CoachRequest
  setCoachRequest: React.Dispatch<React.SetStateAction<CoachRequest | null>>
}) {
  const statusColor =
    coachRequest.status === 'approved'
      ? 'bg-green-500/10 text-green-600'
      : coachRequest.status === 'declined'
      ? 'bg-red-500/10 text-red-600'
      : 'bg-yellow-500/10 text-yellow-600'

  const [error, setError] = useState<string>('')

  const handleDelete = async () => {
    try {
      await apiWithAuth.delete(`/api/coaches/requests/me/delete/`)
      setCoachRequest(null)
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        const message =
          err.response?.data?.detail ||
          err.response?.data?.message ||
          'Failed to delete coach request'
        setError(message)
      } else {
        setError('Network error or no response')
      }
    }
  }

  useEffect(() => {
    if (error) {
      toast.error(error)
      setError('')
    }
  }, [error])

  return (
    <Card className="rounded-2xl">
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle className="text-xl">{coachRequest.title}</CardTitle>
          {coachRequest.created_at && (
            <p className="text-sm text-muted-foreground">
              Submitted {format(new Date(coachRequest.created_at), 'PPP p')}
            </p>
          )}
        </div>

        <Badge className={statusColor}>{coachRequest.status}</Badge>
      </CardHeader>

      <Separator />

      <CardContent className="space-y-5 pt-6">
        <section>
          <h4 className="font-semibold mb-1">Bio</h4>
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">
            {coachRequest.bio}
          </p>
        </section>

        <section className="grid grid-cols-2 gap-4">
          <Info
            label="Experience"
            value={`${coachRequest.experience_years} years`}
          />
          <Info
            label="Monthly Rate"
            value={`$${Number(coachRequest.monthly_rate) || 0} / month`}
          />
        </section>

        <List
          label="Certifications"
          items={normalize(coachRequest.certifications)}
        />
        <List
          label="Specialization"
          items={normalize(coachRequest.specialization)}
        />
        <List label="Languages" items={normalize(coachRequest.languages)} />

        {coachRequest.status === 'declined' && coachRequest.decline_reason && (
          <section className="rounded-lg bg-destructive/10 p-3">
            <h4 className="font-semibold text-destructive mb-1">
              Decline Reason
            </h4>
            <p className="text-sm text-destructive">
              {coachRequest.decline_reason}
            </p>
            <Button
              variant="outline"
              onClick={handleDelete}
              className="mt-3 block ms-auto"
            >
              Send New Request
            </Button>
          </section>
        )}
      </CardContent>
    </Card>
  )
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  )
}

function List({ label, items }: { label: string; items: string[] }) {
  return (
    <section>
      <h4 className="font-semibold mb-2">{label}</h4>
      <div className="flex flex-wrap gap-2">
        {items.map((item, i) => (
          <Badge key={i} variant="secondary">
            {item}
          </Badge>
        ))}
      </div>
    </section>
  )
}
