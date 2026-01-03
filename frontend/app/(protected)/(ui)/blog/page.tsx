import { Metadata } from 'next'
import { Suspense } from 'react'
import BlogContent from '@/components/blog/BlogContent'
import SearchForm from '@/components/blog/SearchForm'
import Loader from '@/components/ui/loader'

export const metadata: Metadata = {
  title: 'What’s New | Nutrition App',
  description:
    'Discover new features, updates, and improvements in the nutrition app.',
}

const BlogPage = () => {
  return (
    <>
      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight">
          Insights & Articles
        </h1>
        <p className="mt-3 text-muted-foreground max-w-xl">
          New features, improvements, and insights to help you eat smarter and
          track your nutrition better.
        </p>
      </div>
      <SearchForm />
      <Suspense fallback={<Loader />}>
        <BlogContent />
      </Suspense>
    </>
  )
}

export default BlogPage
