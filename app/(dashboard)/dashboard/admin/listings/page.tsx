import { cookies } from 'next/headers'

import ManageTourListingTable from '@/components/Admin/ManageTourListings'

export default async function LisingPage() {
  // Get cookies
  // const cookieStore = cookies()
  // const accessToken = (await cookieStore).get('accessToken')?.value
  
  // if (!accessToken) {
  //   return (
  //     <div className="p-8">
  //       <h2>Authentication Required</h2>
  //       <p>Please log in to view this page.</p>
  //       <a href="/login">Go to Login</a>
  //     </div>
  //   )
  // }

  //  const deletion = async (id:string)=>{

  // }


  


  try {
    
    const res = await fetch("http://localhost:5000/api/tour", {
      method: "GET",
      cache: "no-store",
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

   

    const data = result?.data
    
    if (!result.success) {
      throw new Error(result.message)
    }

    return <ManageTourListingTable tours={data} />

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