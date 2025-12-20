import CoreNavbar from '@/components/CoreNavbar'
import ProtectedRoute from '@/components/auth/ProtectedRoute'

export default function CoreLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ProtectedRoute>
      <CoreNavbar />
      {children}
    </ProtectedRoute>
  )
}
