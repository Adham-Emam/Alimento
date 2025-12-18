import Image from 'next/image'
import { format } from 'date-fns'

import { FaHeart, FaRegHeart } from 'react-icons/fa'

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

interface PageProps {
  post: BlogPostProps
  toggleLike: () => Promise<void>
  isLiking: boolean
}

const BlogDetailCard = ({ post, toggleLike, isLiking }: PageProps) => {
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
