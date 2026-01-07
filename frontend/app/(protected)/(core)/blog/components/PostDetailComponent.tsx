'use client'
import axios from 'axios'
import { apiWithAuth } from '@/lib/api'
import { useState, useEffect, FormEvent } from 'react'
import { notFound, useParams } from 'next/navigation'
import BlogDetailCard from '@/app/(protected)/(core)/blog/components/BlogDetailCard'
import PostComments from '@/app/(protected)/(core)/blog/components/PostComments'
import BlogCardSkeleton from '@/app/(protected)/(core)/blog/components/BlogCardSkeleton'
import type { BlogPostProps } from '@/types'

const BlogDetailComponent = () => {
  const params = useParams<{ slug: string }>()
  const slug = params?.slug
  const [post, setPost] = useState<BlogPostProps | null>(null)
  const [comment, setComment] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [isNotFound, setIsNotFound] = useState(false)
  const [isLiking, setIsLiking] = useState<boolean>(false)

  const getPost = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await apiWithAuth.get<BlogPostProps>(
        `/api/blog/posts/${slug}`
      )
      setPost(res.data)
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 404) {
          setIsNotFound(true)
          return
        }
        setError(err.response?.data?.detail || 'Failed to load blog post')
      } else {
        setError('Unexpected error occurred')
      }
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getPost()
  }, [slug])

  const toggleLike = async () => {
    if (!post || isLiking) return
    setIsLiking(true)

    try {
      const res = await apiWithAuth.post<{ liked: boolean }>(
        `/api/blog/posts/${post.id}/like/`
      )
      const liked = res.data.liked
      setPost((prev) => {
        if (!prev) return prev
        return {
          ...prev,
          is_liked: liked,
          likes: liked ? [...prev.likes, {}] : prev.likes.slice(0, -1),
        }
      })
    } catch (err) {
      console.error('Failed to toggle like', err)
    } finally {
      setIsLiking(false)
    }
  }

  const handleCommentSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!post || !comment.trim()) return

    try {
      setIsLoading(true)
      const res = await apiWithAuth.post(
        `api/blog/posts/${post?.id}/comments/create/`,
        {
          content: comment,
        }
      )
      const data = res.data
      setPost((prev) => {
        if (!prev) return prev
        return {
          ...prev,
          comments: [data, ...prev.comments],
        }
      })
      setComment('') // clear input
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to load blog post')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) return <BlogCardSkeleton />

  if (isNotFound) {
    notFound()
  }

  if (error)
    return <div className="text-center py-10 text-destructive">{error}</div>

  if (!post) return null

  return (
    slug && (
      <>
        <BlogDetailCard
          post={post}
          toggleLike={toggleLike}
          isLiking={isLiking}
        />
        <PostComments
          comments={post.comments}
          comment={comment}
          setComment={setComment}
          handleSubmit={handleCommentSubmit}
        />
      </>
    )
  )
}

export default BlogDetailComponent
