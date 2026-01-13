'use client'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import SkeletonComponent from '@/components/layout/SkeletonComponent'
import type { Product } from '@/types'

export default function ProductDetailComponent({
  product,
}: {
  product: Product
}) {
  if (!product) return <SkeletonComponent />

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="max-w-4xl mx-auto p-6 flex flex-col md:flex-row gap-8"
    >
      {/* Right side: details */}
      <div className=" flex flex-col gap-4">
        <h1 className="text-3xl font-bold">{product.title}</h1>
        <span className="text-xs px-2 py-1 rounded-full bg-accent/20 text-accent font-medium w-max">
          {product.product_type}
        </span>
        <p className="text-muted-foreground">{product.description}</p>

        {/* Price */}
        <p className="text-2xl font-semibold">${product.price}</p>

        {/* Nutrition info */}
        {product.calories && (
          <div className="flex gap-4 mt-2">
            <span className="text-sm">Calories: {product.calories} kcal</span>
            <span className="text-sm">Protein: {product.protein} g</span>
            <span className="text-sm">Fat: {product.fat} g</span>
            <span className="text-sm">Carbs: {product.carbohydrates} g</span>
          </div>
        )}

        {/* Advisory / Contraindications */}
        {(product.advisory_text || product.contraindications) && (
          <div className="mt-4 text-sm text-muted-foreground space-y-1">
            {product.advisory_text && (
              <p>
                <span className="font-semibold">Advisory:</span>{' '}
                {product.advisory_text}
              </p>
            )}
            {product.contraindications && (
              <p>
                <span className="font-semibold">Contraindications:</span>{' '}
                {product.contraindications}
              </p>
            )}
          </div>
        )}

        {/* Buy / Affiliate button */}
        {product.affiliate_link && (
          <Button asChild className="mt-6 w-full" variant="default">
            <a
              href={product.affiliate_link}
              target="_blank"
              rel="noopener noreferrer"
            >
              Buy Now
            </a>
          </Button>
        )}
      </div>
    </motion.div>
  )
}
