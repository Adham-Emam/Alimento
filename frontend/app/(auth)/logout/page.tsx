'use client'
import { useAuth } from '@/contexts/AuthContext'
import { useEffect } from 'react'
import { ImSpinner8 } from 'react-icons/im'

const LogoutPage = () => {
  const { logout } = useAuth()

  useEffect(() => {
    logout()
  })
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <ImSpinner8 className="animate-spin w-8 h-8" />
    </div>
  )
}

export default LogoutPage
