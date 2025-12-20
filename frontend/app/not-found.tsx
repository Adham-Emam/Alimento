import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import errorImage from '@/public/404-Error.svg'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      <div className="max-w-md">
        <Image
          src={errorImage}
          alt="Page not found"
          width={400}
          height={400}
          priority
          className="mx-auto"
        />

        <h1 className="mt-6 text-3xl font-bold">Page not found</h1>

        <p className="mt-2 text-muted-foreground">
          Sorry, the page you’re looking for doesn’t exist or has been moved.
        </p>

        <Button asChild className="mt-6">
          <Link href="/">Go back home</Link>
        </Button>
      </div>
    </div>
  )
}
