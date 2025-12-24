import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Profile | Aliménto App',
  description:
    'Discover new features, updates, and improvements in the nutrition app.',
}

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
