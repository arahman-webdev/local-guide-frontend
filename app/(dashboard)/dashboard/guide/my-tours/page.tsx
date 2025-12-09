import ManageBooking from "@/components/Admin/ManageBooking"
import MyTourListing from "@/components/Guide/MyTours"
import { cookies } from "next/headers"


export default async function MyTourPage() {

    const cookieStore = cookies()
    const accessToken = (await cookieStore).get('accessToken')?.value
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tour/my-tours`, {
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

    console.log("my tours", data)


    return (
        <div>
            <MyTourListing tours={data} />
        </div>
    )
}
