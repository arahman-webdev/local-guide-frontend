import ManageBooking from "@/components/Admin/ManageBooking"
import MyTourListing from "@/components/Guide/MyTours"
import { cookies } from "next/headers"

export default async function MyTourPage() {
    // Get cookies on the server
    const cookieStore = cookies();
    const accessToken = (await cookieStore).get('accessToken')?.value;
    
    // Prepare headers
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };
    
    // Add Authorization header if token exists in cookies
    if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
    }
    
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tour/my-tours`, {
            method: "GET",
            cache: "no-store",
            headers: headers,
            credentials: "include",
        });

        if (!res.ok) {
            console.error('Failed to fetch tours:', res.status, res.statusText);
            throw new Error(`Failed to fetch tours: ${res.status}`);
        }

        const result = await res.json();
        
        // Handle case where API returns success: false
        if (!result.success) {
            console.error('API returned error:', result.message);
            return (
                <div className="p-6">
                    <h1 className="text-2xl font-bold text-red-600">Error</h1>
                    <p>{result.message || 'Failed to load tours'}</p>
                </div>
            );
        }

        const data = result?.data || [];
        console.log("My tours data:", data);

        return (
            <div>
                <MyTourListing tours={data} />
            </div>
        );
        
    } catch (error: any) {
        console.error('Error in MyTourPage:', error);
        
        return (
            <div className="p-6">
                <h1 className="text-2xl font-bold text-red-600">Error Loading Tours</h1>
                <p className="text-gray-600">{error.message || 'Something went wrong'}</p>
            </div>
        );
    }
}