'use client'
import { useEffect, useState } from 'react'
import { apiWithAuth } from '@/lib/api'
import { Button } from '@/components/ui/button'

interface UserDataProps {
  health_data: {
    target_macros: {
      calories: number
    }
    dietary_preferences: string[]
  }
  profile: {
    activity_level: string
    goal: string
  }
}

const GoalsCard = ({ setCurrentCard }: any) => {
  const [user, setUser] = useState<UserDataProps | null>(null)

  const getUser = async () => {
    try {
      const res = await apiWithAuth.get<UserDataProps>('api/auth/users/me/')
      setUser(res.data)
    } catch (error: any) {
      console.error(error.response?.data?.detail || 'Failed to load user data')
      setUser(null)
    }
  }

  useEffect(() => {
    getUser()
  }, [])

  return (
    <>
      <h2 className="mb-8 text-2xl font-bold">Goals & Preferences</h2>

      <div className="flex justify-between items-center bg-primary/20 p-4 rounded-2xl">
        <div>
          <h3 className="text-lg font-semibold">Daily Calories Target</h3>
          <p>Based on your activity level: {user?.profile.activity_level}</p>
        </div>
        <span className="text-header text-2xl font-bold">
          {user?.health_data?.target_macros?.calories || 0}
        </span>
      </div>

      <div>
        <h3 className="text-lg font-semibold mt-4">Dietary Preferences</h3>
        <ul className="my-5 font-medium flex gap-2">
          {user?.health_data?.dietary_preferences.map((preference, index) => (
            <li
              key={index}
              className="px-3 py-1 bg-accent/40 rounded-2xl w-fit"
            >
              {preference}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="text-lg font-semibold mt-4 mb-2">Goal</h3>
        <p className="bg-accent/40 rounded-2xl w-fit px-4 py-1">
          {user?.profile.goal}
        </p>
      </div>

      <Button
        variant="outline"
        className="text-header border-header mt-10 rounded-full w-full hover:border-accent"
        onClick={() => setCurrentCard('Account')}
      >
        Update Preferences
      </Button>
    </>
  )
}

export default GoalsCard
