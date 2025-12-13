import Link from 'next/link'
import AuthForm from '@/components/auth/AuthForm'

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-xl bg-card rounded-2xl shadow-lg border border-border p-8">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold mb-2">Welcome back</h1>
          <p className="text-sm text-muted-foreground">
            Login to continue your healthy journey
          </p>
        </div>

        <AuthForm mode="login" />

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{' '}
          <Link
            href="/register"
            className="font-semibold text-header hover:text-header/80 underline-offset-2 hover:underline"
          >
            Create one
          </Link>
        </p>
      </div>
    </main>
  )
}
