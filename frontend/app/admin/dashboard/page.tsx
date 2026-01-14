'use client'

import { apiWithAuth } from '@/lib/api'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { format } from 'date-fns'
import type { CoachRequest } from '@/types'
import { Button } from '@/components/ui/button'
import NotFound from '@/app/not-found'
import { useAppSelector } from '@/redux/hooks'
import axios from 'axios'
import Loader from '@/components/ui/loader'

export default function Page() {
  const { user } = useAppSelector((state) => state.auth)

  const [coachRequests, setCoachRequests] = useState<CoachRequest[] | null>(
    null
  )
  const [isLoading, setIsLoading] = useState(true)
  const [isStaff, setIsStaff] = useState(false)

  useEffect(() => {
    if (user?.is_staff) {
      setIsStaff(true)
    }
  }, [user])

  const getRequests = async () => {
    setIsLoading(true)
    try {
      const res = await apiWithAuth.get<CoachRequest[]>(
        '/api/coaches/requests/list/'
      )
      setCoachRequests(res.data)
    } catch (err: any) {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.detail || 'Failed to load coach requests'
        : 'Failed to load coach requests'
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getRequests()
  }, [])

  const handleApprove = async (id: number) => {
    try {
      await apiWithAuth.patch(`/api/coaches/admin/requests/${id}/approve/`)
      toast.success('Request approved')

      setCoachRequests((prev) =>
        prev ? prev.filter((req) => req.id !== id) : prev
      )
    } catch {
      toast.error('Failed to approve request')
    }
  }

  const handleDecline = async (id: number) => {
    try {
      await apiWithAuth.post(`/api/coaches/admin/requests/${id}/decline/`, {
        decline_reason: 'Not a good fit at the moment',
      })
      toast.success('Request declined')

      setCoachRequests((prev) =>
        prev ? prev.filter((req) => req.id !== id) : prev
      )
    } catch {
      toast.error('Failed to decline request')
    }
  }

  if (isLoading && !isStaff) return <NotFound />
  if (isLoading || !coachRequests) return <Loader />

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Coach Requests</h2>

      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="p-3 text-left">Title</th>
              <th className="p-3 text-left">Experience</th>
              <th className="p-3 text-left">Rate</th>
              <th className="p-3 text-left">Languages</th>
              <th className="p-3 text-left">Created</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {coachRequests.map((request, index) => (
              <tr key={index} className="border-t hover:bg-muted/50">
                <td className="p-3">
                  <div className="font-medium">{request.title}</div>
                  <div className="text-muted-foreground text-xs">
                    {request.bio}
                  </div>
                </td>

                <td className="p-3">{request.experience_years} yrs</td>

                <td className="p-3">${request.monthly_rate}/mo</td>

                <td className="p-3">
                  {typeof request.languages === 'string'
                    ? request.languages
                    : request.languages?.join(', ')}
                </td>

                <td className="p-3">
                  {request.created_at &&
                    format(new Date(request.created_at), 'yyyy-MM-dd')}
                </td>

                <td className="p-3 flex gap-2 justify-center">
                  <Button size="sm" onClick={() => handleApprove(request.id)}>
                    Approve
                  </Button>

                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDecline(request.id)}
                  >
                    Decline
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
