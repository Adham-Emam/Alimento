import {
  SexType,
  MeasurementUnitsType,
  ActivityLevelType,
  GoalType,
} from '@/contexts/OnboardingContext'

const currencies = [
  { id: 'EGP', label: 'EGP (E£)', symbol: 'E£' },
  { id: 'USD', label: 'USD ($)', symbol: '$' },
  { id: 'EUR', label: 'EUR (€)', symbol: '€' },
  { id: 'GBP', label: 'GBP (£)', symbol: '£' },
  { id: 'SAR', label: 'SAR (﷼)', symbol: '﷼' },
]

const sexOptions: { id: SexType; label: string; icon: string }[] = [
  { id: 'male', label: 'Male', icon: '👨' },
  { id: 'female', label: 'Female', icon: '👩' },
]

const measurementUnits: {
  id: MeasurementUnitsType
  label: string
  description: string
}[] = [
  { id: 'metric', label: 'Metric', description: 'm / kg' },
  { id: 'imperial', label: 'Imperial', description: 'ft / lb' },
]

const activityLevels: {
  id: ActivityLevelType
  label: string
  description: string
  icon: string
}[] = [
  {
    id: 'sedentary',
    label: 'Sedentary',
    description: 'Little to no exercise, desk job',
    icon: '🪑',
  },
  {
    id: 'light',
    label: 'Light',
    description: 'Light exercise 1-3 days/week',
    icon: '🚶',
  },
  {
    id: 'moderate',
    label: 'Moderate',
    description: 'Moderate exercise 3-5 days/week',
    icon: '🏃',
  },
  {
    id: 'active',
    label: 'Active',
    description: 'Hard exercise 6-7 days/week',
    icon: '🏋️',
  },
]

const goals: {
  id: GoalType
  label: string
  description: string
  icon: string
}[] = [
  {
    id: 'maintenance',
    label: 'Maintenance',
    description: 'Maintain current weight and body composition',
    icon: '⚖️',
  },
  {
    id: 'cutting',
    label: 'Cutting',
    description: 'Lose fat while preserving muscle mass',
    icon: '🔥',
  },
  {
    id: 'bulking',
    label: 'Bulking',
    description: 'Build muscle with calorie surplus',
    icon: '💪',
  },
  {
    id: 'recomp',
    label: 'Recomp',
    description: 'Build muscle and lose fat simultaneously',
    icon: '🎯',
  },
]

const dietaryOptions = [
  { id: 'vegetarian', label: 'Vegetarian', icon: '🥬' },
  { id: 'vegan', label: 'Vegan', icon: '🌱' },
  { id: 'keto', label: 'Keto', icon: '🥑' },
  { id: 'paleo', label: 'Paleo', icon: '🥩' },
  { id: 'mediterranean', label: 'Mediterranean', icon: '🫒' },
  { id: 'gluten-free', label: 'Gluten-Free', icon: '🌾' },
  { id: 'dairy-free', label: 'Dairy-Free', icon: '🥛' },
  { id: 'halal', label: 'Halal', icon: '🍖' },
]

const allergens = [
  { id: 'nuts', label: 'Nuts', icon: '🥜' },
  { id: 'dairy', label: 'Dairy', icon: '🧀' },
  { id: 'eggs', label: 'Eggs', icon: '🥚' },
  { id: 'shellfish', label: 'Shellfish', icon: '🦐' },
  { id: 'fish', label: 'Fish', icon: '🐟' },
  { id: 'legumes', label: 'Legumes', icon: '🫘' },
  { id: 'gluten', label: 'Gluten', icon: '🌾' },
]

const medicalConditions = [
  { id: 'diabetes', label: 'Diabetes', icon: '💉' },
  { id: 'hypertension', label: 'Hypertension', icon: '❤️' },
  { id: 'heart-disease', label: 'Heart Disease', icon: '🫀' },
  { id: 'celiac', label: 'Celiac Disease', icon: '🌾' },
  { id: 'ibs', label: 'IBS', icon: '🔄' },
  { id: 'kidney-disease', label: 'Kidney Disease', icon: '🫘' },
]

export {
  currencies,
  sexOptions,
  measurementUnits,
  activityLevels,
  goals,
  dietaryOptions,
  allergens,
  medicalConditions,
}
