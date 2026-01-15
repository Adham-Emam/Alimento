'use client'

import { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import { apiWithAuth } from '@/lib/api'
import { toast } from 'sonner'
import { FaMagnifyingGlass } from 'react-icons/fa6'
import { Button } from '@/components/ui/button'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import CoachCard from './CoachCard'
import type { Coach } from '@/types'

interface PaginationProps<T> {
  results: T[]
  next: string | null
  previous: string | null
}

export default function CoachesComponent() {
  const [coaches, setCoaches] = useState<Coach[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [nextCursor, setNextCursor] = useState<string | null>(null)
  const [prevCursor, setPrevCursor] = useState<string | null>(null)
  const [inputQ, setInputQ] = useState('')
  const [searchQ, setSearchQ] = useState('')
  const formRef = useRef<HTMLFormElement>(null)

  const getCoaches = async (search: string, url?: string) => {
    setError(null)

    try {
      const res = await apiWithAuth.get<PaginationProps<Coach>>(
        url ?? `/api/coaches/?search=${search}`
      )

      setCoaches(res.data.results)
      setNextCursor(res.data.next)
      setPrevCursor(res.data.previous)
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const message =
          err.response?.data?.detail ||
          err.response?.data?.message ||
          'Failed to load coaches'

        setError(message)
      } else {
        setError('Unexpected error occurred')
      }
    }
  }

  useEffect(() => {
    setNextCursor(null)
    setPrevCursor(null)
    getCoaches(searchQ)
  }, [searchQ])

  const handleNext = () => {
    if (nextCursor) getCoaches(searchQ, nextCursor)
  }

  const handlePrevious = () => {
    if (prevCursor) getCoaches(searchQ, prevCursor)
  }

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSearchQ(inputQ.trim())
  }

  useEffect(() => {
    if (error) {
      toast.error(error)
      setError(null)
    }
  }, [error])

  if (!coaches)
    return (
      <p className="text-muted-foreground text-sm text-center mt-8">
        Oops... No coaches found. Check back soon.
      </p>
    )

  return (
    <>
      {/* Search */}
      <form
        ref={formRef}
        onSubmit={handleSearch}
        className="flex-1 flex items-center border px-4 py-2 mb-8 rounded-full mt-3 bg-card"
      >
        <input
          type="text"
          value={inputQ}
          onChange={(e) => setInputQ(e.target.value)}
          placeholder="Search coaches"
          className="flex-1 outline-none bg-transparent"
        />
        <Button
          size="icon"
          type="submit"
          className="bg-background dark:text-white rounded-full"
        >
          <FaMagnifyingGlass />
        </Button>
      </form>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {coaches.length > 0 ? (
          coaches.map((coach) => <CoachCard key={coach.user} {...coach} />)
        ) : (
          <p className="text-muted-foreground text-sm text-center">
            No coaches match your search.
          </p>
        )}
      </div>

      {/* Pagination */}
      {(nextCursor || prevCursor) && (
        <Pagination className="mt-6">
          <PaginationContent className="w-full flex justify-between">
            <PaginationItem>
              <Button asChild variant="outline">
                <PaginationPrevious
                  onClick={handlePrevious}
                  className={
                    !prevCursor ? 'pointer-events-none opacity-50' : ''
                  }
                />
              </Button>
            </PaginationItem>

            <PaginationItem>
              <Button asChild variant="outline">
                <PaginationNext
                  onClick={handleNext}
                  className={
                    !nextCursor ? 'pointer-events-none opacity-50' : ''
                  }
                />
              </Button>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </>
  )
}
