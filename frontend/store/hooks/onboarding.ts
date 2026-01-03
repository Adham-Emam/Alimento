import { useAppSelector, useAppDispatch } from '@/store/hooks'
import {
  nextStep,
  prevStep,
  setUserData,
  setProfileData,
  setHealthData,
  reset,
  setStep,
  checkOnboardingStatus,
  completeOnboarding,
} from '@/store/slices/onboardingSlice'

export const useOnboarding = () => {
  const dispatch = useAppDispatch()
  const onboardingState = useAppSelector((state) => state.onboarding)

  return {
    ...onboardingState,
    nextStep: () => dispatch(nextStep()),
    prevStep: () => dispatch(prevStep()),
    setUserData: (data: { first_name?: string; last_name?: string }) =>
      dispatch(setUserData(data)),
    setProfileData: (
      data: Partial<import('@/store/slices/onboardingSlice').ProfileData>
    ) => dispatch(setProfileData(data)),
    setHealthData: (
      data: Partial<import('@/store/slices/onboardingSlice').HealthData>
    ) => dispatch(setHealthData(data)),
    setStep: (step: number) => dispatch(setStep(step)),
    complete: () => dispatch(completeOnboarding(onboardingState.data)),
    reset: () => dispatch(reset()),
    refetch: () => dispatch(checkOnboardingStatus()),
    checkOnboardingStatus: () => dispatch(checkOnboardingStatus()),
  }
}
