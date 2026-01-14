'use client'

import { FaRegBell } from 'react-icons/fa'
import { IoPersonOutline } from 'react-icons/io5'
import { GoGoal } from 'react-icons/go'
import { MdSecurity } from 'react-icons/md'
import { Separator } from '@/components/ui/separator'
import { FiLogOut } from 'react-icons/fi'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { logout } from '@/redux/slices/authSlice'
import { Dumbbell } from 'lucide-react'

const sideBarNavigation = [
  { name: 'Account', icon: <IoPersonOutline /> },
  { name: 'Goals & Preferences', icon: <GoGoal /> },
  { name: 'Notifications', icon: <FaRegBell /> },
  { name: 'Privacy & Security', icon: <MdSecurity /> },
]

export default function SideBar({ currentCard, setCurrentCard }: any) {
  const { user } = useAppSelector((state) => state.auth)
  const dispatch = useAppDispatch()

  return (
    <div className="flex-1">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-foreground">Profile</h1>
        <p className="text-muted-foreground">
          Manage your account and preferences
        </p>
      </div>
      <ul>
        {sideBarNavigation.map((item) => (
          <li
            key={item.name}
            className={`cursor-pointer p-4 mb-2 rounded-lg duration-300 flex items-center gap-2 text-lg font-medium ${
              currentCard === item.name
                ? 'bg-foreground text-header-foreground'
                : 'hover:bg-foreground/20'
            }`}
            onClick={() => setCurrentCard(item.name)}
          >
            {item.icon}
            {item.name}
          </li>
        ))}

        {user?.subscription.is_coach && (
          <li
            className={`cursor-pointer bg-accent/50 text-foreground! p-4 mb-2 rounded-lg duration-300 flex items-center gap-2 text-lg font-medium ${
              currentCard === 'Coach Requests'
                ? 'bg-accent text-header-foreground'
                : 'hover:bg-accent/50'
            }`}
            onClick={() => setCurrentCard('Coach Requests')}
          >
            <Dumbbell />
            Coach Requests
          </li>
        )}
        <Separator />
        <li
          className="text-lg font-medium my-4 p-4 cursor-pointer duration-300 hover:bg-destructive/20 rounded-lg flex items-center gap-2 text-destructive"
          onClick={() => dispatch(logout())}
        >
          <FiLogOut className="w-6 h-6" /> Sign Out
        </li>
      </ul>
    </div>
  )
}
