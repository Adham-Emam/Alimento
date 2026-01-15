import { api } from '@/lib/api'
import ProductDetailComponent from './components/ProductDetailComponent'
import type { Product } from '@/types'
import { notFound } from 'next/navigation'
import { toast } from 'sonner'

interface Props {
  params: { slug: string }
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params

  let product: Product | null = null
  try {
    const res = await api.get<Product>(`/api/marketplace/products/${slug}/`)
    product = res.data
  } catch (err: any) {
    if (err?.response?.status === 404) {
      return notFound()
    }
    console.error('Unexpected error:', err)
  }

  if (!product) {
    return notFound()
  }

  return <ProductDetailComponent product={product} />
}
