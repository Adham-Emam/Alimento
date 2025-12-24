import OptionCard from './OptionCard'

interface Props {
    value: string | null
    onChange: (value: string) => void
}

export default function GoalStep({ value, onChange }: Props) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <OptionCard
                title="Lose Weight"
                subtitle="Calorie deficit"
                selected={value === 'cutting'}
                onClick={() => onChange('cutting')}
            />
            <OptionCard
                title="Build Muscle"
                subtitle="High protein meals"
                selected={value === 'bulking'}
                onClick={() => onChange('bulking')}
            />
            <OptionCard
                title="Recomposition"
                subtitle="Lose fat & gain muscle"
                selected={value === 'recomp'}
                onClick={() => onChange('recomp')}
            />
            <OptionCard
                title="Maintenance"
                subtitle="Stay the same"
                selected={value === 'maintenance'}
                onClick={() => onChange('maintenance')}
            />
        </div>
    )
}
