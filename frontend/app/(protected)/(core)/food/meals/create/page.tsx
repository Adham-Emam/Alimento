import { Metadata } from 'next'
import MealCreateComponent from './components/MealCreateComponent'

export const metadata: Metadata = {
  title: 'Create Meal | Aliménto App',
  description:
    'Discover new features, updates, and improvements in the nutrition app.',
}

export default function MealCreatePage() {
  return <MealCreateComponent />
}
