"use client"

import { getMyProfile } from '@/app/utility/auth'
import React, { useEffect, useState } from 'react'

export default function Navbar() {
        const [user, setUser] = useState<any | null>(null)

    useEffect(() => {
        const fetchUser = async () => {
            const response = await getMyProfile()
            setUser(response?.data || null)
        }
        fetchUser()
    }, [])

    console.log("user.....", user)

  return (
    <div>Navbar</div>
  )
}
