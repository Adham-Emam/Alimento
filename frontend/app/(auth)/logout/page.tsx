import { useAppDispatch } from '@/store/hooks'
import { logout } from '@/store/slices/authSlice'
import { ImSpinner8 } from 'react-icons/im'

const LogoutPage = () => {
  const dispatch = useAppDispatch()

  dispatch(logout())

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <ImSpinner8 className="animate-spin w-8 h-8" />
    </div>
  )
}

export default LogoutPage
