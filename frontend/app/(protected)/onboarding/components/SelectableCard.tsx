import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'
import type { SelectableCardProps } from '@/types'

export default function SelectableCard({
  selected,
  onClick,
  icon,
  label,
  description,
  className,
}: SelectableCardProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        'relative rounded-2xl p-4 text-left transition-all border-2',
        selected
          ? 'border-primary bg-primary/10 shadow-soft'
          : 'border-border bg-card hover:border-primary/50',
        className
      )}
    >
      {selected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center"
        >
          <Check className="w-3 h-3 text-primary-foreground" />
        </motion.div>
      )}
      <span className="text-2xl mb-2 block">{icon}</span>
      <span className="font-medium text-foreground block">{label}</span>
      {description && (
        <span className="text-sm text-muted-foreground">{description}</span>
      )}
    </motion.button>
  )
}
