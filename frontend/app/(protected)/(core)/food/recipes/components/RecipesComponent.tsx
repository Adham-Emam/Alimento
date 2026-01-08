'use client'

import { useEffect, useState, useRef } from 'react'
import { apiWithAuth } from '@/lib/api'
import Loader from '@/components/ui/loader'
import type { Recipe, PaginationProps } from '@/types'
import { FaMagnifyingGlass } from 'react-icons/fa6'
import axios from 'axios'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import RecipeCard from './RecipeCard'

export default function RecipesComponent() {
  const [recipes, setRecipes] = useState<Recipe[] | null>(null)
  const [nextCursor, setNextCursor] = useState<string | null>(null)
  const [prevCursor, setPrevCursor] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [inputQ, setInputQ] = useState('')
  const [searchQ, setSearchQ] = useState('')
  const formRef = useRef<HTMLFormElement>(null)

  const fetchRecipes = async (search: string, url?: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const res = await apiWithAuth.get<PaginationProps<Recipe>>(
        url ?? `/api/foods/recipes/?search=${encodeURIComponent(search)}`
      )

      setRecipes(res.data.results)
      setNextCursor(res.data.next)
      setPrevCursor(res.data.previous)
    } catch (err: any) {
      if (axios.isAxiosError(err) && err.response) {
        setError(
          err.response.data.detail ||
            err.response.data.message ||
            'Failed to load recipes'
        )
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
    fetchRecipes(searchQ)
  }, [searchQ])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setSearchQ(inputQ.trim())
  }

  if (error) {
    return (
      <p className="bg-destructive/20 text-destructive border border-destructive p-4 rounded-2xl mt-4">
        {error}
      </p>
    )
  }

  return (
    <>
      {/* Search */}
      <form
        ref={formRef}
        onSubmit={handleSearch}
        className="flex items-center border px-4 py-2 rounded-full bg-card mt-4"
      >
        <input
          value={inputQ}
          onChange={(e) => setInputQ(e.target.value)}
          placeholder="Search for recipes..."
          className="flex-1 outline-none"
        />
        <Button
          size="icon"
          className="rounded-full"
          variant="outline"
          type="submit"
        >
          <FaMagnifyingGlass />
        </Button>
      </form>

      {/* List */}
      {isLoading || !recipes ? (
        <Loader />
      ) : (
        <div className="py-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {recipes.length ? (
            recipes.map((recipe) => (
              <div key={recipe.id}>
                <Link
                  href={`/food/recipes/recipe/${encodeURIComponent(
                    recipe.slug
                  )}`}
                >
                  <RecipeCard {...recipe} />
                </Link>
              </div>
            ))
          ) : (
            <p className="text-xl text-center col-span-full">
              No recipes found
            </p>
          )}
        </div>
      )}

      {/* Pagination */}
      {(nextCursor || prevCursor) && (
        <Pagination className="mt-6">
          <PaginationContent className="w-full flex justify-between">
            <PaginationItem>
              <Button
                variant="outline"
                disabled={!prevCursor}
                onClick={() => prevCursor && fetchRecipes(searchQ, prevCursor)}
              >
                <PaginationPrevious />
              </Button>
            </PaginationItem>

            <PaginationItem>
              <Button
                variant="outline"
                disabled={!nextCursor}
                onClick={() => nextCursor && fetchRecipes(searchQ, nextCursor)}
              >
                <PaginationNext />
              </Button>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </>
  )
}
