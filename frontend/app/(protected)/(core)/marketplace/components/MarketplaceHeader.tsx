'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { BicepsFlexed } from 'lucide-react'

export default function MarketplaceHeader() {
  const pathname = usePathname()

  return (
    <>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Marketplace</h1>
          <p className="text-muted-foreground mt-1">
            {pathname === '/marketplace/products'
              ? 'Browse a curated selection of healthy meals, herbs, and wellness products sourced from trusted partners to support your nutrition and daily health goals.'
              : 'Book personalized one-on-one sessions with certified health and fitness coaches to receive expert guidance tailored to your goals and lifestyle.'}
          </p>
        </div>
        <Button asChild>
          <Link href="/plans">
            <BicepsFlexed /> Become a Coach
          </Link>
        </Button>
      </div>
      <div className="w-full bg-card border flex items-center justify-between rounded-2xl overflow-hidden mt-5">
        <Button
          className={`flex-1 rounded-none ${
            pathname === '/marketplace/products'
              ? 'bg-accent hover:bg-accent! text-primary-foreground'
              : 'bg-transparent hover:bg-accent/20 text-card-foreground dark:hover:text-card-foreground'
          }`}
          variant="ghost"
          asChild
        >
          <Link href="/marketplace/products">Products</Link>
        </Button>
        <Button
          className={`flex-1 rounded-none ${
            pathname === '/marketplace/coaches'
              ? 'bg-accent hover:bg-accent! text-primary-foreground'
              : 'bg-transparent hover:bg-accent/20 text-card-foreground dark:hover:text-card-foreground'
          }`}
          variant="ghost"
          asChild
        >
          <Link href="/marketplace/coaches">Coaches</Link>
        </Button>
      </div>
    </>
  )
}
