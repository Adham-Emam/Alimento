'use client'

import { useEffect, useState } from 'react'
import { apiWithAuth, api } from '@/lib/api'
import { useSearchParams, useRouter } from 'next/navigation'
import PostCard from '@/components/feeds/PostCard'
import RightBar from '@/components/feeds/RightBar'
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
import { ImSpinner8 } from 'react-icons/im'

interface PostProps {
  id: string
  title: string
  content?: string
  image?: string
  score: number
  author: string
  createdAt: string
  userVote: 'up' | 'down' | null
}

interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

// const DUMMY_POSTS: PostProps[] = [
//   {
//     id: '1',
//     title: 'Best street food in Cairo?',
//     content: 'What are your favorite street food spots?',
//     votes: 128,
//     author: 'Ahmed',
//     createdAt: '2h ago',
//     userVote: null,
//   },
//   {
//     id: '2',
//     title: 'This view never gets old',
//     image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee',
//     votes: 542,
//     author: 'Mona',
//     createdAt: '5h ago',
//     userVote: null,
//   },
//   {
//     id: '3',
//     title: 'Any good Next.js resources?',
//     content: 'I want advanced tutorials for App Router.',
//     votes: 76,
//     author: 'Youssef',
//     createdAt: '1d ago',
//     userVote: null,
//   },
// ]

export default function FeedsPage() {
  const [posts, setPosts] = useState<PostProps[]>([])
  const [count, setCount] = useState(0)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const searchParams = useSearchParams()
  const router = useRouter()

  const q = searchParams.get('q')
  const page = Number(searchParams.get('page') ?? 1)

  const totalPages = Math.ceil(count / 10)

  const getPosts = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await apiWithAuth.get<PaginatedResponse<PostProps>>(
        `api/community/posts/?page=${page}${q ? `&search=${q}` : ''}`
      )
      console.log(res.data)
      setPosts(res.data.results)
      setCount(res.data.count)
    } catch (err: any) {
      console.error(err)
      setError(err?.response?.data?.detail || 'Failed to load blog posts')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    document.title = 'Feeds | Alimento'
    getPosts()
    // setPosts(DUMMY_POSTS)
  }, [page, q])

  const goToPage = (p: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', p.toString())
    router.push(`?${params.toString()}`)
  }

  const handleVote = async (postId: string, type: 'up' | 'down') => {
    try {
      await apiWithAuth.post(`api/community/posts/${postId}/${type}vote/`)

      setPosts((prevPosts) =>
        prevPosts.map((post) => {
          if (post.id !== postId) return post

          let newScore = post.score
          let newUserVote: 'up' | 'down' | null = type

          // Toggle logic
          if (post.userVote === type) {
            // remove vote
            newUserVote = null
            newScore += type === 'up' ? -1 : 1
          } else {
            // switch vote
            if (post.userVote === 'up') newScore -= 1
            if (post.userVote === 'down') newScore += 1

            newScore += type === 'up' ? 1 : -1
          }

          return {
            ...post,
            score: newScore,
            userVote: newUserVote,
          }
        })
      )
    } catch (err) {
      console.error('Vote failed', err)
    }
  }

  const trendingPosts = [...posts].sort((a, b) => b.score - a.score).slice(0, 4)

  return (
    <main className="min-h-screen bg-background px-4 py-32">
      {/* Loading */}
      {isLoading && (
        <div className="text-center text-muted-foreground">
          <ImSpinner8 className="animate-spin text-2xl" />
        </div>
      )}

      {/* Error */}
      {error && <div className="text-center text-destructive">{error}</div>}

      {/* Empty */}
      {!isLoading && !error && posts.length === 0 && (
        <div className="text-center text-muted-foreground">
          No blog posts found.
        </div>
      )}

      {!isLoading && !error && posts.length > 0 && (
        <div className="mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
          {/* FEED */}
          <div className="space-y-6">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} onVote={handleVote} />
            ))}
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

                    if (
                      p === 1 ||
                      p === totalPages ||
                      Math.abs(p - page) <= 1
                    ) {
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
          </div>

          {/* RIGHT BAR */}
          <RightBar posts={trendingPosts} />
        </div>
      )}
    </main>
  )
}
