import ManageBooking from "@/components/Admin/ManageBooking"
import { cookies } from "next/headers"


export default async function BookinPage() {

    const cookieStore = cookies()
    const accessToken = (await cookieStore).get('accessToken')?.value
    const res = await fetch("http://localhost:5000/api/bookings", {
        method: "GET",
        cache: "no-store",
        headers: {
            'Cookie': `accessToken=${accessToken}`,
            // Add other cookies if needed
            'Content-Type': 'application/json',
        },
        credentials: "include",
    })

    if (!res.ok) {
        throw new Error("Failed to fetch bookings")
    }

    const result = await res.json()
    console.log(result)

    const data = result?.data 


    return (
        <div>
            <ManageBooking bookings={data} />
        </div>
    )
}
