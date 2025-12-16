import BlogDetailCard from '@/components/blog/BlogDetailCard'
import PostComments from '@/components/blog/PostComments'

interface PageProps {
  params: {
    slug: string
  }
}

const BlogDetailPage = async ({ params }: PageProps) => {
  const { slug } = await params

  return (
    <main className="container mx-auto py-10">
      <BlogDetailCard slug={slug} />
      <PostComments />
    </main>
  )
}

export default BlogDetailPage
