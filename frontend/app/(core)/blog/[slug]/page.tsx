import { Metadata } from 'next'
import { api } from '@/lib/api'
import type { BlogPostProps } from '@/types'
import BlogDetailComponent from './PostDetailComponent'

interface PageProps {
  params: Promise<{ slug: string }>
}

export const generateMetadata = async ({
  params,
}: PageProps): Promise<Metadata> => {
  const { slug } = await params
  const post = await api.get<BlogPostProps>(`/api/blog/posts/${slug}`)

  return {
    title: post.data.title,
    description: post.data.excerpt,
  }
}

export default function BlogDetailPage() {
  return <BlogDetailComponent />
}
