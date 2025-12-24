'use client'

import { useState } from 'react'
import Stepper from '@/components/onboarding/Stepper'
import GoalStep from '@/components/onboarding/GoalStep'
import DietaryStep from '@/components/onboarding/DietaryStep'
import AllergiesStep from '@/components/onboarding/AllergiesStep'
import ActivityStep from '@/components/onboarding/ActivityStep'

type OnboardingData = {
    goal: string | null
    dietary_preferences: string[]
    allergies: string[]
    activity_level: string | null
}

export default function OnboardingPage() {
    const [step, setStep] = useState(0)
    const [data, setData] = useState<OnboardingData>({
        goal: null,
        dietary_preferences: [],
        allergies: [],
        activity_level: null,
    })

    const steps = [
        <GoalStep
            value={data.goal}
            onChange={goal => setData({ ...data, goal })}
        />,
        <DietaryStep
            values={data.dietary_preferences}
            onChange={dietary_preferences =>
                setData({ ...data, dietary_preferences })
            }
        />,
        <AllergiesStep
            values={data.allergies}
            onChange={allergies => setData({ ...data, allergies })}
        />,
        <ActivityStep
            value={data.activity_level}
            onChange={activity_level =>
                setData({ ...data, activity_level })
            }
        />,
    ]

    const isValid =
        (step === 0 && data.goal) ||
        (step === 1 && true) ||
        (step === 2 && true) ||
        (step === 3 && data.activity_level)

    return (
        <main className="min-h-screen bg-background px-4 py-10">
            <div className="mx-auto max-w-3xl">
                <Stepper step={step} />

                <h1 className="text-2xl font-bold text-header mb-2 text-center">
                    Onboarding
                </h1>

                <div className="mt-8">{steps[step]}</div>

                <div className="mt-10 flex justify-between">
                    <button
                        disabled={step === 0}
                        onClick={() => setStep(s => s - 1)}
                        className="text-muted-foreground disabled:opacity-40"
                    >
                        Back
                    </button>

                    <button
                        disabled={!isValid}
                        onClick={() => {
                            if (step === steps.length - 1) {
                                console.log('FINAL DATA', data)
                            } else {
                                setStep(s => s + 1)
                            }
                        }}
                        className="rounded-full bg-primary px-6 py-2 text-primary-foreground disabled:opacity-40"
                    >
                        {step === steps.length - 1 ? 'Complete Setup' : 'Continue'}
                    </button>
                </div>
            </div>
        </main>
    )
}
