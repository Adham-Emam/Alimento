interface OptionCardProps {
    title: string
    subtitle?: string
    selected: boolean
    onClick: () => void
}

export default function OptionCard({
    title,
    subtitle,
    selected,
    onClick,
}: OptionCardProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`w-full rounded-xl border p-4 text-left transition ${selected
                ? 'border-primary bg-primary/10'
                : 'border-border hover:border-primary/40'
                }`}
        >
            <p className="font-medium text-header">{title}</p>
            {subtitle && (
                <p className="text-sm text-muted-foreground">{subtitle}</p>
            )}
        </button>
    )
}
