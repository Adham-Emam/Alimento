'use client'
import { useState } from 'react'
import SideBar from './SideBar'
import AccountCard from './AccountCard'
import GoalsCard from './GoalsCard'
import NotificationCard from './NotificationCard'
import PrivacyCard from './PrivacyCard'
import CoachRequests from './CoachRequests'
import { useAppSelector } from '@/redux/hooks'

const ProfileBody = () => {
  const { user } = useAppSelector((state) => state.auth)
  const [currentCard, setCurrentCard] = useState(
    user?.subscription.is_coach ? 'Coach Requests' : 'Account'
  )

  const getCurrentCard = () => {
    switch (currentCard) {
      case 'Account':
        return <AccountCard />
      case 'Goals & Preferences':
        return <GoalsCard setCurrentCard={setCurrentCard} />
      case 'Notifications':
        return <NotificationCard />
      case 'Privacy & Security':
        return <PrivacyCard />
      case 'Coach Requests':
        return <CoachRequests />
    }
  }

  return (
    <>
      <SideBar currentCard={currentCard} setCurrentCard={setCurrentCard} />
      <div className="flex-3 h-fit rounded-2xl bg-card py-10 px-8 shadow-xl">
        {getCurrentCard()}
      </div>
    </>
  )
}

export default ProfileBody
