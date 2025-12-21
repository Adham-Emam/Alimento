interface TrendingPost {
  id: string
  title: string
  score: number
}

interface RightBarProps {
  posts: TrendingPost[]
}

export default function RightBar({ posts }: RightBarProps) {
  return (
    <aside className="hidden lg:block">
      <div className="sticky top-24 space-y-4">
        <div className="rounded-xl border border-border bg-card p-4">
          <h3 className="text-sm font-semibold text-header mb-3">
            Trending Today
          </h3>

          <ul className="space-y-3">
            {posts.map((post) => (
              <li key={post.id}>
                <p className="text-sm font-medium line-clamp-2">{post.title}</p>
                <span className="text-xs text-muted-foreground">
                  {post.score} votes
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground">
          Eat healthy. Stay active. Share your journey with the community.
        </div>
      </div>
    </aside>
  )
}
