import ProtectedRoute from '@/components/auth/ProtectedRoute'

export default function CoreLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <ProtectedRoute>{children}</ProtectedRoute>
}
