import { Metadata } from 'next'
import { Suspense } from 'react'
import RecipesComponent from '@/components/food/recipes/RecipesComponent'
import Loader from '@/components/ui/loader'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Recipes | Aliménto App',
  description:
    'Discover new features, updates, and improvements in the nutrition app.',
}

export default function CommunityPage() {
  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold">Recipes</h2>
          <p className="text-muted-foreground">
            Manage your Recipes and their Ingredients
          </p>
        </div>
        <Button asChild>
          <Link href="/food/recipes/create">
            <Plus /> Add Recipe
          </Link>
        </Button>
      </div>

      <Suspense fallback={<Loader />}>
        <RecipesComponent />
      </Suspense>
    </>
  )
}
