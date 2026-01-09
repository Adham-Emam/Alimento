import { Dispatch, SetStateAction } from 'react'

export interface UserProps {
  id: number
  email: string
  first_name: string
  last_name: string
  is_active: boolean
  is_staff: boolean

  profile: {
    preferred_currency: string
    birth_date: string | null // YYYY-MM-DD
    sex: 'male' | 'female' | null
    height_cm: number | null
    weight_kg: number | null
    measurement_units: 'metric' | 'imperial'
    activity_level: 'sedentary' | 'light' | 'moderate' | 'active'
    goal: 'maintenance' | 'cutting' | 'bulking' | 'recomp' | null
  }

  health_data: {
    dietary_preferences: string[]
    allergies: string[]
    medical_conditions: string[]
    target_macros: {
      calories: number
      protein_g: number
      carbs_g: number
      fats_g: number
    }
  }

  subscription: {
    current_period_end: string
    is_coach: boolean
    is_pro: boolean
  }

  created_at?: string
  updated_at?: string
}

export interface BlogPostProps {
  id: number
  likes: any[]
  comments: any[]
  is_liked: boolean
  title: string
  slug: string
  excerpt: string
  thumbnail: string | null
  content: string
  category: string
  reading_time: number
  created_at: string
  updated_at: string
}

export interface Nutrition {
  nutrition_basis: string
  calories: number
  protein: number
  protein_type: 'vegan' | 'dairy' | 'meat' | 'other'
  carbohydrates: number
  fats: number
  fiber: number
  sugar: number
  sodium: number
  iron: number
  calcium: number
  potassium: number
  zinc: number
  magnesium: number
  vitamin_a: number
  vitamin_c: number
}

export interface ServingSize {
  description: string
  quantity: number
  unit: string
}

export interface FoodItemProps {
  id?: number
  name: string
  price: number
  price_quantity: number
  price_unit: string
  price_per_gram_protein?: number
  serving_size: ServingSize[]
  nutrition: Nutrition
  created_at?: string
}

export interface Ingredient {
  id: number
  food_item: FoodItemProps
  quantity: number
  unit: string
}

export interface Instructions {
  step_number: number
  text: string
}

export interface FoodItem {
  id: number
  name: string
  price: string
  price_quantity: number
  price_unit: string
  serving_size: ServingSize[]
  nutrition: Nutrition
  price_per_gram_protein: string
  created_at: string
}

export interface Recipe {
  id: number
  name: string
  slug: string
  description: string
  is_public: boolean
  ingredients: Ingredient[]
  calories: string
  protein_g: string
  carbs_g: string
  fats_g: string
  created_at: string
  instructions: Instructions[]
}

export interface PaginationProps<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

export interface SelectableCardProps {
  selected: boolean
  onClick: () => void
  icon: string
  label: string
  description?: string
  className?: string
}

export interface AuthState {
  user: UserProps | null
  isLoading: boolean
  isAuthenticated: boolean
}

export interface PostProps {
  id: string
  title: string
  content?: string
  image?: string
  score: number
  author: string
  createdAt: string
  userVote: 'up' | 'down' | null
}

export interface FoodItemPopupProps {
  item: FoodItemProps | null
  onClose: () => void
}

export interface BlogPageProps {
  params: Promise<{ slug: string }>
}

export interface CreateFoodItemPopupProps {
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
}

export type MealIngredient = {
  id: number
  quantity: number
  unit: string
  food_item: {
    id: number
    name: string
    nutrition: Nutrition
  }
}

export type Meal = {
  id: number
  name: string
  slug: string
  meal_type: 'breakfast' | 'lunch' | 'dinner'
  ingredients: MealIngredient[]
  recipes: Recipe[]
  calories: string
  protein_g: string
  carbs_g: string
  fats_g: string
  created_at: string
}
