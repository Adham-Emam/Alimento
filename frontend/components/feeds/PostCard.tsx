interface Post {
    id: string
    title: string
    content?: string
    image?: string
    votes: number
    author: string
    createdAt: string
    userVote: 'up' | 'down' | null
}

interface PostCardProps {
    post: Post
    onVote: (postId: string, type: 'up' | 'down') => void
}

export default function PostCard({ post, onVote }: PostCardProps) {
    return (
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <div className="flex gap-4">
                {/* VOTES */}
                <div className="flex flex-col items-center gap-1 text-sm">
                    <button
                        onClick={() => onVote(post.id, 'up')}
                        className={`font-bold transition ${post.userVote === 'up'
                            ? 'text-primary'
                            : 'text-muted-foreground hover:text-header'
                            }`}
                    >
                        ▲
                    </button>

                    <span className="font-medium">{post.votes}</span>

                    <button
                        onClick={() => onVote(post.id, 'down')}
                        className={`font-bold transition ${post.userVote === 'down'
                            ? 'text-destructive'
                            : 'text-muted-foreground hover:text-header'
                            }`}
                    >
                        ▼
                    </button>
                </div>

                {/* CONTENT */}
                <div className="flex-1">
                    <h2 className="text-lg font-semibold text-header mb-2">
                        {post.title}
                    </h2>

                    {post.content && (
                        <p className="text-sm text-foreground/80 mb-3">
                            {post.content}
                        </p>
                    )}

                    {post.image && (
                        <img
                            src={post.image}
                            alt={post.title}
                            className="w-full rounded-lg mb-3 object-cover"
                        />
                    )}

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Posted by {post.author}</span>
                        <span>{post.createdAt}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
