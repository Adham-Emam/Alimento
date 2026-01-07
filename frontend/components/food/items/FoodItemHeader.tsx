'use client'
import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import CreateFoodItemPopup from './CreateFoodItemPopup'
import { Plus } from 'lucide-react'

export default function FoodItemHeader() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold">Food Items</h2>
          <p className="text-muted-foreground">
            Manage your raw ingredients and their nutrition profiles
          </p>
        </div>
        <Button onClick={() => setIsOpen(true)}>
          <Plus /> Add Food Item
        </Button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <CreateFoodItemPopup isOpen={isOpen} setIsOpen={setIsOpen} />
        )}
      </AnimatePresence>
    </>
  )
}
