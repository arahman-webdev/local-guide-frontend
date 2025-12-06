import { cookies } from "next/headers"


export default async function BookinPage() {

    const cookieStore = cookies()
    const accessToken = (await cookieStore).get('accessToken')?.value
    const res = await fetch("http://localhost:5000/api/bookings", {
        method: "GET",
        cache: "no-store",
        credentials: "include",
        headers:{
            "Cookie":`${accessToken}`
        }
    })

    // if(!res.ok){
    //     throw new Error("Failed to fetch bookings")
    // }

    const result = await res.json()
    console.log(result)
    return (
        <div>BookinPage</div>
    )
}
