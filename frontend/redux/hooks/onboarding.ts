import { useAppSelector, useAppDispatch } from '@/redux/hooks'
import {
  nextStep,
  prevStep,
  setUserData,
  setProfileData,
  setHealthData,
  reset,
  setStep,
} from '@/redux/slices/onboardingSlice'
import {
  checkOnboardingStatus,
  completeOnboarding,
} from '@/redux/api/onboarding'
import type { ProfileData, HealthData } from '@/types/onboarding'

export const useOnboarding = () => {
  const dispatch = useAppDispatch()
  const onboardingState = useAppSelector((state) => state.onboarding)

  return {
    ...onboardingState,
    nextStep: () => dispatch(nextStep()),
    prevStep: () => dispatch(prevStep()),
    setUserData: (data: { first_name?: string; last_name?: string }) =>
      dispatch(setUserData(data)),
    setProfileData: (data: Partial<ProfileData>) =>
      dispatch(setProfileData(data)),
    setHealthData: (data: Partial<HealthData>) => dispatch(setHealthData(data)),
    setStep: (step: number) => dispatch(setStep(step)),
    complete: () => dispatch(completeOnboarding(onboardingState.data)),
    reset: () => dispatch(reset()),
    refetch: () => dispatch(checkOnboardingStatus()),
    checkOnboardingStatus: () => dispatch(checkOnboardingStatus()),
  }
}
