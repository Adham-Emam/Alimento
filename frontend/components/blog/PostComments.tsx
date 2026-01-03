import { format } from 'date-fns'
import { Button } from '../ui/button'
import { FormEvent, useEffect } from 'react'

interface CommentProps {
  id: number
  username: string
  user?: {
    id: number
  }
  content: string
  created_at: string
}

interface PageProps {
  comments: CommentProps[] | null
  comment: string
  setComment: React.Dispatch<React.SetStateAction<string>>
  handleSubmit: (e: FormEvent) => void | Promise<void>
}

const PostComments = ({
  comments,
  comment,
  setComment,
  handleSubmit,
}: PageProps) => {
  if (!comments) {
    return null
  }

  return (
    <section className="max-w-3xl mx-auto mt-10 space-y-6 border bg-card rounded-2xl px-4 py-8">
      <h2 className="text-2xl font-semibold">Comments ({comments.length})</h2>
      <form
        onSubmit={handleSubmit}
        className=" flex items-center justify-between gap-4 border rounded-full px-4  bg-background text-card-foreground"
      >
        <input
          type="text"
          name="comment"
          placeholder="Share your thoughts…"
          className="flex-1 w-full outline-none py-4"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <Button className="rounded-full">Comment</Button>
      </form>
      {comments.length === 0 ? (
        <p className="text-muted-foreground text-center">
          No comments yet. Be the first to comment.
        </p>
      ) : (
        <ul className="space-y-4 bg-card rounded-2xl px-4 py-2">
          {comments.map((comment) => (
            <li
              key={comment.id}
              className="border rounded-xl p-4 bg-background"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">
                  {comment.username.trim() || 'Anonymous'}
                </span>
                <span className="text-xs text-muted-foreground">
                  {format(new Date(comment.created_at), 'PPP')}
                </span>
              </div>

              <p className="text-sm leading-relaxed">{comment.content}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default PostComments
