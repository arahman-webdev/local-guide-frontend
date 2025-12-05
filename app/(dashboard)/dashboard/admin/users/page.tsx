import { cookies } from 'next/headers'
import ManageUsers from '@/components/Admin/ManageUsers'

export default async function ManageUsersPage() {
  // Get cookies
  const cookieStore = cookies()
  const accessToken = (await cookieStore).get('accessToken')?.value
  
  // Check if user is authenticated via middleware
  if (!accessToken) {
    // This means middleware already redirected or user isn't logged in
    // But just in case, show an error
    return (
      <div className="p-8">
        <h2>Authentication Required</h2>
        <p>Please log in to view this page.</p>
        <a href="/login">Go to Login</a>
      </div>
    )
  }

  try {
    // MANUALLY forward cookies to your backend
    const res = await fetch("http://localhost:5000/api/auth/users", {
      method: "GET",
      cache: "no-store",
      headers: {
        'Cookie': `accessToken=${accessToken}`,
        // Add other cookies if needed
        'Content-Type': 'application/json',
      },
      // credentials: "include" won't work for cross-origin unless CORS is properly set
    })

    if (res.status === 401) {
      // Token expired
      return (
        <div className="p-8">
          <h2>Session Expired</h2>
          <p>Your session has expired. Please log in again.</p>
          <a href="/login">Login Again</a>
        </div>
      )
    }

    if (!res.ok) {
      throw new Error(`Failed to fetch users: ${res.status}`)
    }

    const result = await res.json()

    console.log(result.data)

    const data = result?.data
    
    if (!result.success) {
      throw new Error(result.message)
    }

    return <ManageUsers users={data} accessToken={accessToken} />

  } catch (error:any) {
    console.error("Error:", error)
    return (
      <div className="p-8">
        <h2>Error Loading Users</h2>
        <p>{error.message}</p>
      </div>
    )
  }
}