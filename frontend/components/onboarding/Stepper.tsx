interface StepperProps {
    step: number
}

export default function Stepper({ step }: StepperProps) {
    const steps = ['Goals', 'Diet', 'Allergies', 'Activity']

    return (
        <div className="flex items-center justify-center gap-6 mb-10">
            {steps.map((_, index) => (
                <div
                    key={index}
                    className={`h-3 w-3 rounded-full ${index <= step ? 'bg-primary' : 'bg-border'
                        }`}
                />
            ))}
        </div>
    )
}
