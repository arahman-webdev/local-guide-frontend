export const getMyProfile = async () => {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/me`, {
            method: "GET",
            headers: { "content-type": "json/application" },
            credentials: "include"
        })

        const data = await res.json()

    

        return {
            isAuthenticated: true,
            data: data?.data
        }

    } catch (err) {
        console.log(err)
        return {
            isAuthenticated: false,
            data: null
        }
    }
}