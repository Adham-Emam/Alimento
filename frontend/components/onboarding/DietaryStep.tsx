import OptionCard from './OptionCard'

const OPTIONS = [
    'Vegetarian',
    'Vegan',
    'Keto',
    'Paleo',
    'Mediterranean',
    'Gluten-Free',
    'Dairy-Free',
    'No Preference',
]

interface Props {
    values: string[]
    onChange: (values: string[]) => void
}

export default function DietaryStep({ values, onChange }: Props) {
    const toggle = (item: string) => {
        onChange(
            values.includes(item)
                ? values.filter(v => v !== item)
                : [...values, item]
        )
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {OPTIONS.map(option => (
                <OptionCard
                    key={option}
                    title={option}
                    selected={values.includes(option)}
                    onClick={() => toggle(option)}
                />
            ))}
        </div>
    )
}
