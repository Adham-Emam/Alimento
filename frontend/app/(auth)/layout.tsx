import { Suspense } from 'react'
import AuthRedirection from './components/AuthRedirection'
import Loader from '@/components/ui/loader'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <Suspense fallback={<Loader />}>
        <AuthRedirection>{children}</AuthRedirection>
      </Suspense>
    </>
  )
}
