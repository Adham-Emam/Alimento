import { Suspense } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import AuthForm from '@/components/auth/AuthForm'
import Logo from '@/public/Logo.png'

export default function RegisterPage() {
  return (
    <main className="min-h-screen flex items-center justify-between bg-background w-full h-screen overflow-hidden">
      <div className="flex-1 hidden md:flex flex-col items-center justify-center relative overflow-hidden bg-linear-to-br from-background via-primary/40 to-accent/30 h-full">
        <Image
          src={Logo}
          alt="Login"
          width={150}
          height={150}
          priority
          className="p-8 bg-card rounded-2xl drop-shadow-2xl mb-8"
        />
        <div className="relative z-10 text-center">
          <h2 className="text-2xl font-bold">Start your journey</h2>
          <p className="mt-2 text-md max-w-2xl text-muted-foreground">
            Join thousands who have transformed their eating habits with
            personalized nutrition plans and AI-powered meal recommendations.
          </p>
        </div>
      </div>
      <div className="relative z-10 flex-1 bg-card h-screen flex flex-col justify-center shadow-header shadow-md p-8">
        <div className="mb-6">
          <div className="mb-10">
            <span className="text-header text-3xl font-bold flex items-center gap-2 mb-8">
              <div className="bg-background p-2 rounded-2xl">
                <Image src={Logo} alt="Logo" width={35} height={35} priority />
              </div>
              Aliménto
            </span>
            <h1 className="text-3xl font-bold mb-2">Create your account</h1>
            <p className="text-sm text-muted-foreground">
              Start your personalized nutrition journey today
            </p>
          </div>
        </div>

        <Suspense fallback={null}>
          <AuthForm mode="register" />
        </Suspense>

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
