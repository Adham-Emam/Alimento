import OptionCard from './OptionCard'

interface Props {
    value: string | null
    onChange: (value: string) => void
}

export default function ActivityStep({ value, onChange }: Props) {
    return (
        <div className="space-y-4">
            <OptionCard
                title="Sedentary"
                subtitle="Little to no exercise"
                selected={value === 'sedentary'}
                onClick={() => onChange('sedentary')}
            />
            <OptionCard
                title="Light"
                subtitle="1–3 days/week"
                selected={value === 'light'}
                onClick={() => onChange('light')}
            />
            <OptionCard
                title="Moderate"
                subtitle="3–5 days/week"
                selected={value === 'moderate'}
                onClick={() => onChange('moderate')}
            />
            <OptionCard
                title="Active"
                subtitle="6–7 days/week"
                selected={value === 'active'}
                onClick={() => onChange('active')}
            />
        </div>
    )
}
