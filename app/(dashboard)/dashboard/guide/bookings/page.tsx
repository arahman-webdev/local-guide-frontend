import ManageBooking from "@/components/Admin/ManageBooking"
import MyTourBookings from "@/components/Guide/MyTourBookings"
import MyTourListing from "@/components/Guide/MyTours"
import { cookies } from "next/headers"


export default async function MyBookingPage() {

    const cookieStore = cookies()
    const accessToken = (await cookieStore).get('accessToken')?.value
    const res = await fetch("http://localhost:5000/api/bookings/my-tours-booking", {
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

    console.log("my booking tours", data)


    return (
        <div>
            <MyTourBookings bookings={data} />
        </div>
    )
}
