import { Metadata } from 'next'
import { Suspense } from 'react'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Loader from '@/components/ui/loader'
import MealComponent from './components/MealComponent'

export const metadata: Metadata = {
  title: 'Meals | Aliménto App',
  description:
    'Discover new features, updates, and improvements in the nutrition app.',
}

export default function MealsPage() {
  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold">Meals</h2>
          <p className="text-muted-foreground">
            Manage your Meals and their Ingredients
          </p>
        </div>
        <Button asChild>
          <Link href="/food/meals/create">
            <Plus /> Add Meal
          </Link>
        </Button>
      </div>

      <Suspense fallback={<Loader />}>
        <MealComponent />
      </Suspense>
    </>
  )
}
