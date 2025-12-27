import { cn } from '@/lib/utils'

interface NutritionBadgeProps {
  type: 'calories' | 'protein' | 'carbs' | 'fats' | 'fiber'
  value: number
  unit?: string
  className?: string
}

const config = {
  calories: { label: 'Cal', color: 'bg-accent/15 text-accent' },
  protein: {
    label: 'Protein',
    color: 'bg-nutrition-protein/15 text-nutrition-protein',
  },
  carbs: {
    label: 'Carbs',
    color: 'bg-nutrition-carbs/15 text-nutrition-carbs',
  },
  fats: { label: 'Fats', color: 'bg-nutrition-fats/15 text-nutrition-fats' },
  fiber: {
    label: 'Fiber',
    color: 'bg-nutrition-fiber/15 text-nutrition-fiber',
  },
}

export function NutritionBadge({
  type,
  value,
  unit = 'g',
  className,
}: NutritionBadgeProps) {
  const { label, color } = config[type]
  const displayUnit = type === 'calories' ? '' : unit

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium',
        color,
        className
      )}
    >
      <span className="font-semibold">{value}</span>
      <span className="opacity-80">
        {displayUnit} {label}
      </span>
    </span>
  )
}

interface NutritionBarProps {
  current: number
  target: number
  type: 'calories' | 'protein' | 'carbs' | 'fats' | 'fiber'
  showLabel?: boolean
  className?: string
}

const barColors = {
  calories: 'bg-accent',
  protein: 'bg-nutrition-protein',
  carbs: 'bg-nutrition-carbs',
  fats: 'bg-nutrition-fats',
  fiber: 'bg-nutrition-fiber',
}

export function NutritionBar({
  current,
  target,
  type,
  showLabel = true,
  className,
}: NutritionBarProps) {
  const percentage = Math.min((current / target) * 100, 100)
  const { label } = config[type]

  return (
    <div className={cn('space-y-1.5', className)}>
      {showLabel && (
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">{label}</span>
          <span className="font-medium">
            {current} / {target}
            <span className="text-muted-foreground ml-1">
              {type === 'calories' ? 'cal' : 'g'}
            </span>
          </span>
        </div>
      )}
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500',
            barColors[type]
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
