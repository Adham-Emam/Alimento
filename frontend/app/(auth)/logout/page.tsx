'use client'

import { useAppDispatch } from '@/store/hooks'
import { logout } from '@/store/slices/authSlice'
import Loader from '@/components/ui/loader'

const LogoutPage = () => {
  const dispatch = useAppDispatch()

  dispatch(logout())

  return <Loader />
}

export default LogoutPage
