'use client'
import { useEffect, useState, useRef } from 'react'
import { apiWithAuth } from '@/lib/api'
import Loader from '@/components/ui/loader'
import type { FoodItemProps, PaginationProps } from '@/types'
import { FaMagnifyingGlass } from 'react-icons/fa6'
import FoodItemCard from './FoodItemCard'
import FoodItemPopupCard from './FoodItemPopupCard'
import axios from 'axios'
import { AnimatePresence } from 'framer-motion'
import { Button } from '../../ui/button'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

export default function FoodItemsComponent() {
  const [food, setFood] = useState<FoodItemProps[] | null>(null)
  const [nextCursor, setNextCursor] = useState<string | null>(null)
  const [prevCursor, setPrevCursor] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [inputQ, setInputQ] = useState('')
  const [searchQ, setSearchQ] = useState('')
  const formRef = useRef<HTMLFormElement>(null)

  const [isOpen, setIsOpen] = useState(false)
  const [currItem, setCurrItem] = useState<FoodItemProps | null>(null)

  const fetchFood = async (search: string, url?: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const res = await apiWithAuth.get<PaginationProps<FoodItemProps>>(
        url ?? `/api/foods/?search=${encodeURIComponent(search)}`
      )
      setFood(res.data.results)
      setNextCursor(res.data.next)
      setPrevCursor(res.data.previous)
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        // Server responded with an error
        if (error.response) {
          console.error('API Error:', error.response.data)

          const message =
            error.response.data.detail ||
            error.response.data.message ||
            'Failed to load food data'

          setError(message)
        } else {
          console.error('Network error or no response')
        }
      } else {
        console.error('Unexpected error:', error)
      }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    setNextCursor(null)
    setPrevCursor(null)
    fetchFood(searchQ)
  }, [searchQ])

  const handleNext = () => {
    if (nextCursor) {
      fetchFood(searchQ, nextCursor)
    }
  }

  const handlePrevious = () => {
    if (prevCursor) {
      fetchFood(searchQ, prevCursor)
    }
  }

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSearchQ(inputQ.trim())
  }

  const toggleOpen = (item?: FoodItemProps) => {
    if (item) {
      setCurrItem(item)
      setIsOpen(true)
    } else {
      setCurrItem(null)
      setIsOpen(false)
    }
  }

  useEffect(() => {
    if (isOpen) {
      // Prevent background scroll
      document.body.style.overflow = 'hidden'
    } else {
      // Restore scroll
      document.body.style.overflow = ''
    }

    // Cleanup just in case
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (error) {
    return (
      <p className="bg-destructive/20 text-destructive border border-destructive p-4 rounded-2xl mt-4">
        {error}
      </p>
    )
  }

  return (
    <>
      <div className="block md:flex items-center justify-between gap-4">
        <form
          ref={formRef}
          onSubmit={handleSearch}
          className="flex-1 flex items-center border px-4 py-2 rounded-full mt-3 bg-card "
        >
          <input
            type="text"
            value={inputQ}
            onChange={(e) => setInputQ(e.target.value)}
            placeholder="Search for food"
            className="flex-1 outline-none"
          />
          <Button
            size="icon"
            className="bg-background duration-300 dark:text-white rounded-full"
            type="submit"
          >
            <FaMagnifyingGlass />
          </Button>
        </form>

        <div className="mt-4 flex items-center gap-3 ">
          {['Vegan', 'Meat', 'Dairy', 'Other'].map((item) => (
            <Button
              key={item}
              variant="outline"
              onClick={() => {
                const value = item.toLowerCase()
                if (value === searchQ || value === inputQ) {
                  setInputQ('')
                  setSearchQ('')
                } else {
                  setInputQ(value)
                  setSearchQ(value)
                }
              }}
            >
              {item}
            </Button>
          ))}
        </div>
      </div>
      {isLoading || !food ? (
        <Loader />
      ) : (
        <div
          className={`py-8 ${
            food.length > 0
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
              : ''
          }`}
        >
          {food.length > 0 ? (
            food.map((item) => (
              <div key={item.id} onClick={() => toggleOpen(item)}>
                <FoodItemCard {...item} />
              </div>
            ))
          ) : (
            <p className="text-xl text-center">No food items yet, add one!</p>
          )}
        </div>
      )}
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
      {/* Popup */}
      <AnimatePresence>
        {isOpen && currItem && (
          <FoodItemPopupCard item={currItem} onClose={() => toggleOpen()} />
        )}
      </AnimatePresence>
    </>
  )
}
