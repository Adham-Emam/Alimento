import { Metadata } from 'next'
import MarketplaceHeader from '../components/MarketplaceHeader'
import CoachesComponent from './components/CoachesComponent'

export const metadata: Metadata = {
  title: 'Coaches | Aliménto App',
  description:
    'Book personalized one-on-one sessions with certified health and fitness coaches to receive expert guidance tailored to your goals and lifestyle.',
}

export default function CoachesPage() {
  return (
    <div className="min-h-[50vh]">
      <MarketplaceHeader />
      <CoachesComponent />
    </div>
  )
}
