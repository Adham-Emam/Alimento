import { Metadata } from 'next'
import { api } from '@/lib/api'
import type { BlogPostProps, BlogPageProps } from '@/types'
import BlogDetailComponent from '../components/PostDetailComponent'

export const generateMetadata = async ({
  params,
}: BlogPageProps): Promise<Metadata> => {
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
