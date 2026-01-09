import { Metadata } from 'next'
import DashboardHeader from '@/app/(protected)/(core)/dashboard/components/DashboardHeader'

export const metadata: Metadata = {
  title: 'Dashboard | Aliménto App',
  description:
    'Discover new features, updates, and improvements in the nutrition app.',
}

const DashboardPage = () => {
  return <DashboardHeader />
}

export default DashboardPage
