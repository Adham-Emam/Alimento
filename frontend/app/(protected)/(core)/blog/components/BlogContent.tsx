'use client'
import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import Link from 'next/link'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

interface BLogPostProps {
  id: number
  likes: any[]
  comments: []
  is_liked: boolean
  title: string
  slug: string
  excerpt: string
  thumbnail: string | null
  content: string
  category: string
  reading_time: number
  created_at: string
  updated_at: string
}

interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

const BlogContent = () => {
  const [blogs, setBlogs] = useState<BLogPostProps[]>([])
  const [count, setCount] = useState(0)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const searchParams = useSearchParams()
  const router = useRouter()

  const q = searchParams.get('q')
  const page = Number(searchParams.get('page') ?? 1)

  const totalPages = Math.ceil(count / 10)

  const getBlogs = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const res = await api.get<PaginatedResponse<BLogPostProps>>(
        `/api/blog/posts/?page=${page}${q ? `&search=${q}` : ''}`
      )

      setBlogs(res.data.results)
      setCount(res.data.count)
    } catch (err: any) {
      console.error(err)
      setError(err?.response?.data?.detail || 'Failed to load blog posts')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getBlogs()
  }, [page, q])

  const goToPage = (p: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', p.toString())
    router.push(`?${params.toString()}`)
  }

  return (
    <>
      <section className="min-h-[60vh] mx-auto py-10">
        {/* Loading */}
        {isLoading && (
          <div className="text-center text-muted-foreground">
            Loading posts…
          </div>
        )}

        {/* Error */}
        {error && <div className="text-center text-destructive">{error}</div>}

        {/* Empty */}
        {!isLoading && !error && blogs.length === 0 && (
          <div className="text-center text-muted-foreground">
            No blog posts found.
          </div>
        )}

        {/* Blog list */}
        {!isLoading && !error && blogs.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {blogs.map((post) => (
              <article
                key={post.id}
                className="relative pb-5 border rounded-2xl overflow-hidden bg-card shadow-sm hover:shadow-md transition"
              >
                {post.thumbnail && (
                  <img
                    src={post.thumbnail}
                    alt={post.title}
                    className="h-48 w-full object-cover"
                  />
                )}

                <div className="p-5 space-y-3">
                  <span className="text-xs text-muted-foreground">
                    {post.category} · {post.reading_time} min read
                  </span>

                  <h2 className="text-xl font-semibold line-clamp-2">
                    {post.title}
                  </h2>

                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {post.excerpt}
                  </p>

                  <Link
                    href={`/blog/${post.slug}`}
                    className="absolute bottom-4 right-4 block w-fit ms-auto text-sm font-bold text-card-foreground hover:underline"
                  >
                    Read more →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
      {totalPages > 1 && (
        <Pagination className="mt-10">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => goToPage(page - 1)}
                aria-disabled={page === 1}
              />
            </PaginationItem>

            {Array.from({ length: totalPages }).map((_, i) => {
              const p = i + 1

              if (p === 1 || p === totalPages || Math.abs(p - page) <= 1) {
                return (
                  <PaginationItem key={p}>
                    <PaginationLink
                      isActive={p === page}
                      onClick={() => goToPage(p)}
                    >
                      {p}
                    </PaginationLink>
                  </PaginationItem>
                )
              }

              if (p === page - 2 || p === page + 2) {
                return (
                  <PaginationItem key={p}>
                    <PaginationEllipsis />
                  </PaginationItem>
                )
              }

              return null
            })}

            <PaginationItem>
              <PaginationNext
                onClick={() => goToPage(page + 1)}
                aria-disabled={page === totalPages}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </>
  )
}

export default BlogContent
