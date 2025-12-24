import { Metadata } from 'next'
import { api } from '@/lib/api'

interface PageProps {
  params: Promise<{ slug: string }>
}

interface BlogPostProps {
  slug: string
  title: string
  excerpt: string
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

export default function BlogPostLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
