import { Metadata } from 'next'
import FoodItemHeader from './components/FoodItemHeader'
import FoodItemsComponent from './components/FoodItemsComponent'

export const metadata: Metadata = {
  title: 'Food Items | Aliménto App',
  description:
    'Discover new features, updates, and improvements in the nutrition app.',
}

export default function FoodPage() {
  return (
    <>
      <FoodItemHeader />
      <FoodItemsComponent />
    </>
  )
}
