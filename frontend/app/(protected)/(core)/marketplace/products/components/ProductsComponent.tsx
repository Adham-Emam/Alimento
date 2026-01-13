'use client'
import { useEffect, useState, useRef } from 'react'
import { apiWithAuth } from '@/lib/api'
import axios from 'axios'
import ProductCard from './ProductCard'
import type { PaginationProps, Product } from '@/types'
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

export default function ProductsComponent() {
  const [products, setProducts] = useState<Product[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [nextCursor, setNextCursor] = useState<string | null>(null)
  const [prevCursor, setPrevCursor] = useState<string | null>(null)
  const [inputQ, setInputQ] = useState('')
  const [searchQ, setSearchQ] = useState('')
  const formRef = useRef<HTMLFormElement>(null)

  const getProducts = async (search: string, url?: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const res = await apiWithAuth.get<PaginationProps<Product>>(
        url ?? `/api/marketplace/products/?search=${search}`
      )
      setProducts(res.data.results)
      setNextCursor(res.data.next)
      setPrevCursor(res.data.previous)
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const message =
          err.response?.data?.detail ||
          err.response?.data?.message ||
          'Failed to load products'

        setError(message)
      } else {
        setError('Unexpected error occurred')
      }
    } finally {
      setIsLoading(false)
    }
  }
  useEffect(() => {
    setNextCursor(null)
    setPrevCursor(null)
    getProducts(searchQ)
  }, [searchQ])

  const handleNext = () => {
    if (nextCursor) {
      getProducts(searchQ, nextCursor)
    }
  }

  const handlePrevious = () => {
    if (prevCursor) {
      getProducts(searchQ, prevCursor)
    }
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

  if (!products)
    return (
      <p className="text-muted-foreground text-sm text-center mt-8">
        Oops... No products found, Stay tuned for new products.
      </p>
    )

  return (
    <>
      <div className="block md:flex items-center justify-between gap-4 mb-8">
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

        <div className="mt-4 flex-wrap flex items-center gap-3 ">
          {['Supplement', 'Herb', 'Meal', 'Snack'].map((item) => (
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.length > 0 ? (
          products.map((p) => <ProductCard key={p.id} {...p} />)
        ) : (
          <p className="text-muted-foreground text-sm text-center">
            Oops... No products found, Stay tuned for new products.
          </p>
        )}
      </div>

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
