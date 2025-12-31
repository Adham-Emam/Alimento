import { Metadata } from 'next'
import RecipeComponent from './RecipesComponent'

export const metadata: Metadata = {
  title: 'Recipes | Aliménto App',
  description:
    'Discover new features, updates, and improvements in the nutrition app.',
}

const RecipePage = () => {
  return <RecipeComponent />
}

export default RecipePage
