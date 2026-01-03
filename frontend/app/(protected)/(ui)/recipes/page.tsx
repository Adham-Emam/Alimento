import { Metadata } from 'next'
import { Suspense } from 'react'
import RecipeComponent from './RecipesComponent'
import Loader from '@/components/ui/loader'

export const metadata: Metadata = {
  title: 'Recipes | Aliménto App',
  description:
    'Discover new features, updates, and improvements in the nutrition app.',
}

const RecipePage = () => {
  return (
    <Suspense fallback={<Loader />}>
      <RecipeComponent />
    </Suspense>
  )
}

export default RecipePage
