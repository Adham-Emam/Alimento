import Link from 'next/link'
import AuthForm from '@/components/auth/AuthForm'

export default function RegisterPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-xl bg-card rounded-2xl shadow-lg border border-border p-8">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold mb-2">Create your account</h1>
          <p className="text-sm text-muted-foreground">
            Join Alimento and start your healthy journey
          </p>
        </div>

        <AuthForm mode="register" />

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link
            href="/login"
            className="font-semibold text-header hover:text-header/80 underline-offset-2 hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </main>
  )
}
