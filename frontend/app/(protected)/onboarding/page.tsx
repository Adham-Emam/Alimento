import { Metadata } from 'next'
import OnboardingComponent from './components/OnboardingComponent'

export const metadata: Metadata = {
  title: 'Onboarding | Aliménto App',
  description:
    'Discover new features, updates, and improvements in the nutrition app.',
}

const OnboardingPage = () => {
  return <OnboardingComponent />
}

export default OnboardingPage
