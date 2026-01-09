import { Metadata } from 'next'
import ProfileBody from './components/ProfileBody'

export const metadata: Metadata = {
  title: 'Profile | Aliménto App',
  description:
    'Discover new features, updates, and improvements in the nutrition app.',
}

const ProfilePage = () => {
  return (
    <div className="flex flex-col lg:flex-row justify-between gap-4">
      <ProfileBody />
    </div>
  )
}
export default ProfilePage
