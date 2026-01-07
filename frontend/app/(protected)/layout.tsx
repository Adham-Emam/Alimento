import ProtectedRoute from './ProtectedRoute'

export default function CoreLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <ProtectedRoute>{children}</ProtectedRoute>
}
