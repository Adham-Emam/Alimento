import { Metadata } from 'next'
import DashboardComponent from './components/DashboardComponent'

export const metadata: Metadata = {
  title: 'Dashboard | Aliménto App',
  description:
    'Discover new features, updates, and improvements in the nutrition app.',
}

export default function DashboardPage() {
  return <DashboardComponent />
}
