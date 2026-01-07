import CoreNavbar from '@/components/CoreNavbar'
import Footer from '@/components/Landing/Footer'

export default function CoreLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <CoreNavbar />
      <main className="container py-32 min-h-[60vh]">{children}</main>
      <Footer />
    </>
  )
}
