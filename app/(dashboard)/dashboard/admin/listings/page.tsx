import { unstable_noStore as noStore } from 'next/cache';


import ManageTourListingTable from '@/components/Admin/ManageTourListings'

export default async function AdminLisingPage() {

noStore()

  try {
    
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tour`, {
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

    console.log("tour listings", data)
    
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