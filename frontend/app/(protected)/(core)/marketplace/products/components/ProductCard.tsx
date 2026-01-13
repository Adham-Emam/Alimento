'use client'

import Link from 'next/link'
import { Product } from '@/types'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'

const PRODUCT_TYPE_COLORS = {
  SUPPLEMENT: 'bg-blue-300 dark:bg-blue-900 text-card-foreground',
  HERB: 'bg-primary',
  MEAL: 'bg-destructive text-card',
  SNACK: 'bg-accent text-foreground dark:text-background',
}

export default function ProductCard(product: Product) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -50, boxShadow: '0 0 0 0 rgba(0, 0, 0, 0)' }}
      animate={{
        opacity: 1,
        x: 0,
        boxShadow:
          '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
      }}
      transition={{
        duration: 0.3,
        delay: (product.id % 3) * 0.1,
        ease: 'easeOut',
      }}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className={cn(
        'border rounded-2xl p-4 flex flex-col justify-between  bg-card',
        'cursor-pointer'
      )}
    >
      <div className="flex flex-col gap-2">
        <h3 className="font-bold text-lg line-clamp-2">{product.title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-3">
          {product.description}
        </p>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <span className="text-card-foreground font-semibold">
          ${product.price}
        </span>
        <span
          className={`text-xs px-2 py-1 rounded-full font-medium ${
            PRODUCT_TYPE_COLORS[product.product_type]
          }`}
        >
          {product.product_type}
        </span>
      </div>

      <Button asChild>
        <Link
          href={`/marketplace/products/${product.slug}`}
          className="mt-3 inline-block text-center w-full py-2 rounded-lg font-medium hover:bg-accent/90 transition"
        >
          View Details
        </Link>
      </Button>
    </motion.div>
  )
}
