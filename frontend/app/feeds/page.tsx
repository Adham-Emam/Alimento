'use client'

import { useEffect, useState } from 'react'
import PostCard from '@/components/feeds/PostCard'
import RightBar from '@/components/feeds/RightBar'

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

const DUMMY_POSTS: Post[] = [
    {
        id: '1',
        title: 'Best street food in Cairo?',
        content: 'What are your favorite street food spots?',
        votes: 128,
        author: 'Ahmed',
        createdAt: '2h ago',
        userVote: null,
    },
    {
        id: '2',
        title: 'This view never gets old',
        image:
            'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee',
        votes: 542,
        author: 'Mona',
        createdAt: '5h ago',
        userVote: null,
    },
    {
        id: '3',
        title: 'Any good Next.js resources?',
        content: 'I want advanced tutorials for App Router.',
        votes: 76,
        author: 'Youssef',
        createdAt: '1d ago',
        userVote: null,
    },
]

export default function FeedsPage() {
    const [posts, setPosts] = useState<Post[]>([])

    useEffect(() => {
        document.title = 'Feeds | Alimento'
        setPosts(DUMMY_POSTS)
    }, [])

    const handleVote = (postId: string, type: 'up' | 'down') => {
        setPosts(prev =>
            prev.map(post => {
                if (post.id !== postId) return post

                let votes = post.votes
                let userVote: 'up' | 'down' | null = type

                if (post.userVote === type) {
                    votes += type === 'up' ? -1 : 1
                    userVote = null
                } else {
                    if (post.userVote === 'up') votes -= 1
                    if (post.userVote === 'down') votes += 1

                    votes += type === 'up' ? 1 : -1
                }

                return { ...post, votes, userVote }
            })
        )
    }

    const trendingPosts = [...posts]
        .sort((a, b) => b.votes - a.votes)
        .slice(0, 4)

    return (
        <main className="min-h-screen bg-background px-4 py-8">
            <div className="mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
                {/* FEED */}
                <div className="space-y-6">
                    {posts.map(post => (
                        <PostCard
                            key={post.id}
                            post={post}
                            onVote={handleVote}
                        />
                    ))}
                </div>

                {/* RIGHT BAR */}
                <RightBar posts={trendingPosts} />
            </div>
        </main>
    )
}
