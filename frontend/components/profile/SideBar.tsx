import { FaRegBell } from 'react-icons/fa'
import { IoPersonOutline } from 'react-icons/io5'
import { GoGoal } from 'react-icons/go'
import { MdSecurity } from 'react-icons/md'
import { Separator } from '../ui/separator'
import { FiLogOut } from 'react-icons/fi'
import { useAuth } from '@/contexts/AuthContext'
import { FaMoneyBillWave } from 'react-icons/fa'

const sideBarNavigation = [
  { name: 'Account', icon: <IoPersonOutline /> },
  { name: 'Goals & Preferences', icon: <GoGoal /> },
  { name: 'Payment', icon: <FaMoneyBillWave /> },
  { name: 'Notifications', icon: <FaRegBell /> },
  { name: 'Privacy & Security', icon: <MdSecurity /> },
]

export default function SideBar({ currentCard, setCurrentCard }: any) {
  const { logout } = useAuth()

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
        <Separator />
        <li
          className="text-lg font-medium my-4 p-4 cursor-pointer duration-300 hover:bg-destructive/20 rounded-lg flex items-center gap-2 text-destructive"
          onClick={logout}
        >
          <FiLogOut className="w-6 h-6" /> Sign Out
        </li>
      </ul>
    </div>
  )
}
