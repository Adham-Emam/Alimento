import { Metadata } from 'next'
import MarketplaceHeader from '../components/MarketplaceHeader'
import ProductsComponent from './components/ProductsComponent'

export const metadata: Metadata = {
  title: 'Products | Aliménto App',
  description:
    'Shop premium healthy meals, herbs, and wellness products curated from our trusted partners.',
}

export default function ProductsPage() {
  return (
    <div className="min-h-[50vh]">
      <MarketplaceHeader />
      <ProductsComponent />
    </div>
  )
}
