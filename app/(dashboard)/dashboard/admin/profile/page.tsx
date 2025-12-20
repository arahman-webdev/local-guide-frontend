import Profile from '@/components/Dashboard/Profile/Profile'
import { Metadata } from 'next'
import React from 'react'

export const metadata:Metadata = {
  title: 'My Profile | LocalGuide - Account Settings',
  description: 'Manage your LocalGuide profile, account settings, preferences, and personal information. Update profile picture, contact details, and notification settings.',
}

export default function ProfilePage() {
  return (
    <div>
      <Profile />
    </div>
  )
}
