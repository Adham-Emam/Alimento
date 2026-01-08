import { Metadata } from 'next'
import RecipeCreateComponent from './components/RecipeCreateComponent'

export const metadata: Metadata = {
  title: 'Create Recipe | Aliménto App',
  description:
    'Discover new features, updates, and improvements in the nutrition app.',
}

export default function page() {
  return <RecipeCreateComponent />
}
