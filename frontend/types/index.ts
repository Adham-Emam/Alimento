export interface UserProps {
  id: number
  email: string
  first_name: string
  last_name: string
  is_active: boolean
  is_staff: boolean

  profile: {
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
