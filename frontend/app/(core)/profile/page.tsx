'use client'
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import SideBar from '@/components/profile/SideBar'
import AccountCard from '@/components/profile/AccountCard'
import GoalsCard from '@/components/profile/GoalsCard'
import NotificationCard from '@/components/profile/NotificationCard'
import PrivacyCard from '@/components/profile/PrivacyCard'

const ProfilePage = () => {
  const [currentCard, setCurrentCard] = useState('Account')
  const { user } = useAuth()

  const getCurrentCard = () => {
    switch (currentCard) {
      case 'Account':
        return <AccountCard user={user} />
      case 'Goals & Preferences':
        return <GoalsCard />
      case 'Notifications':
        return <NotificationCard />
      case 'Privacy & Security':
        return <PrivacyCard />
    }
  }

  return (
    <main className="container py-32 flex flex-col lg:flex-row justify-between gap-4">
      <SideBar currentCard={currentCard} setCurrentCard={setCurrentCard} />
      <div className="flex-3 h-fit rounded-2xl bg-card py-10 px-8 shadow-xl">
        {getCurrentCard()}
      </div>
    </main>
  )
}
export default ProfilePage
