'use client'
import { useState, ChangeEvent, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '../ui/button'
import { IoSearchSharp } from 'react-icons/io5'

const SearchForm = () => {
  const [query, setQuery] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    router.replace(`/blog?q=${query}`)
  }
  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center justify-between gap-4 border rounded-full py-2 px-5 bg-card"
    >
      <input
        type="text"
        name="search"
        placeholder="Search updates, features, and nutrition tips…"
        value={query}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setQuery(e.target.value)
        }
        className="flex-1 outline-none py-1"
      />
      <Button
        type="submit"
        size="icon"
        variant="secondary"
        className="rounded-full"
      >
        <IoSearchSharp />
      </Button>
    </form>
  )
}

export default SearchForm
