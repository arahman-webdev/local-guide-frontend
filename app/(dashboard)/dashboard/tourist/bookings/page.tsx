
import MyBooking from "@/components/Dashboard/Tourist/MyBooking"
import { cookies } from "next/headers"


export default async function BookingPage() {

    const cookieStore = cookies()
    const accessToken = (await cookieStore).get('accessToken')?.value
    const res = await fetch("http://localhost:5000/api/bookings/my", {
        method: "GET",
        cache: "no-store",
        headers: {
            'Cookie': `accessToken=${accessToken}`,
            // Add other cookies if needed
            'Content-Type': 'application/json',
        },
        credentials: "include",
    })

    // if (!res.ok) {
    //     throw new Error("Failed to fetch bookings")
    // }

    const result = await res.json()
    console.log("from tourist bookings",result)

    const data = result?.data 

    console.log("my tours", data)


    return (
        <div>
            <MyBooking bookings={data} />
        </div>
    )
}
