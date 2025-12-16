'use client'

import { useState, useEffect } from 'react'
import { apiWithAuth } from '@/lib/api'
import Image from 'next/image'
import { format } from 'date-fns'
import axios from 'axios'
import { FaHeart, FaRegHeart } from 'react-icons/fa'
import BlogCardSkeleton from './BlogCardSkeleton'

interface BlogPostProps {
  id: number
  likes: any[]
  comments: any[]
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

const BlogDetailCard = ({ slug }: { slug: string }) => {
  const [post, setPost] = useState<BlogPostProps | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
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

  useEffect(() => {
    window.document.title = post?.title || 'What’s New | Nutrition App'
  }, [post])

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

  if (isLoading) return <BlogCardSkeleton />

  if (error)
    return <div className="text-center py-10 text-destructive">{error}</div>

  if (!post) return null

  return (
    <article className="max-w-3xl mx-auto border rounded-2xl overflow-hidden bg-card shadow-sm p-6 space-y-6">
      {/* Thumbnail */}
      {post.thumbnail && (
        <div className="relative w-full h-64">
          <Image
            src={post.thumbnail}
            alt={post.title}
            fill
            className="object-cover rounded-xl"
          />
        </div>
      )}

      {/* Metadata */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
        <span className="text-sm text-muted-foreground flex items-center gap-2">
          <span className="border border-ring bg-card-foreground text-card rounded-full py-1 px-2">
            {post.category}
          </span>
          <span>{post.reading_time} min read</span>
        </span>
        <span className="text-xs text-muted-foreground">
          Published: {format(new Date(post.created_at), 'PPP')}
        </span>
      </div>

      {/* Title */}
      <h1 className="text-3xl font-bold">{post.title}</h1>

      {/* Excerpt */}
      <p className="text-lg text-muted-foreground">{post.excerpt}</p>

      {/* Content */}
      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* Actions */}
      <div className="flex items-center gap-4 mt-4">
        <button
          onClick={toggleLike}
          disabled={isLiking}
          className="px-4 py-2 flex items-center gap-2 rounded-full text-xl cursor-pointer"
        >
          {post.is_liked ? (
            <FaHeart className="text-card-foreground" />
          ) : (
            <FaRegHeart />
          )}
          {post.likes.length}
        </button>
      </div>
    </article>
  )
}

export default BlogDetailCard
