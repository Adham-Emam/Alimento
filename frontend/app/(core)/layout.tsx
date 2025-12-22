import CoreNavbar from '@/components/CoreNavbar'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import Footer from '@/components/Landing/Footer'

export default function CoreLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ProtectedRoute>
      <CoreNavbar />
      {children}
      <Footer />
    </ProtectedRoute>
  )
}
