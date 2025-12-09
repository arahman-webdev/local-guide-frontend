"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { FormDescription, FormField, FormMessage, FormItem, FormLabel, FormControl, Form } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import Password from "./Layout/Auth/Password"
import Link from "next/link"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
})

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    }
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      console.log('Login attempt with:', values.email);
      
      // First, try the direct backend URL
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Origin': window.location.origin
        },
        credentials: 'include', // This sends cookies
        body: JSON.stringify({
          email: values.email,
          password: values.password
        })
      });

      const data = await response.json();
      console.log('Login response:', data);

      if (data.status && data.data?.accessToken) {
        // Store tokens in localStorage as backup
        localStorage.setItem('accessToken', data.data.accessToken);
        localStorage.setItem('refreshToken', data.data.refreshToken);
        localStorage.setItem('userRole', data.data.user?.role || 'TOURIST');
        localStorage.setItem('user', JSON.stringify(data.data.user || {}));
        
        // Also set in sessionStorage for immediate access
        sessionStorage.setItem('token', data.data.accessToken);
        
        toast.success(data.message || "Login successful!");
        
        // Redirect based on user role
        const userRole = data.data.user?.role;
        switch(userRole) {
          case 'ADMIN':
            router.push('/dashboard/admin');
            break;
          case 'GUIDE':
            router.push('/dashboard/guide');
            break;
          case 'TOURIST':
            router.push('/dashboard/tourist');
            break;
          default:
            router.push('/dashboard');
        }
      } else {
        // Handle error from backend
        const errorMessage = data.message || "Login failed. Please check your credentials.";
        toast.error(errorMessage);
      }
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Check if it's a network/CORS error
      if (error.name === 'TypeError' || error.message.includes('Failed to fetch')) {
        toast.error("Cannot connect to server. Please check your internet connection.");
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input 
                          className="rounded-none p-6" 
                          placeholder="arahman@gmail.com" 
                          type="email" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Password {...field} placeholder="Enter your password" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  disabled={form.formState.isSubmitting}
                  className="w-full bg-[#373DD2] hover:bg-[#373cd2e0] text-white font-semibold rounded-full py-2 text-base"
                >
                  {form.formState.isSubmitting ? "Logging in..." : "Login"}
                </Button>
              </form>
            </Form>

            <div className="text-center text-sm">
              Don't have an account?{" "}
              <Link href={'/signup'} className="underline underline-offset-4 hover:text-blue-600">
                SIGN UP
              </Link>
            </div>
          </div>
          
          <div className="py-5 after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
            <span className="bg-card text-muted-foreground relative z-10 px-2">
              Or continue with
            </span>
          </div>
          
          <div className="">
            <Button
              variant="outline"
              type="button"
              className="w-full flex items-center justify-center gap-2 font-semibold rounded-full py-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
              >
                <path
                  d="M21.805 10.023h-9.785v3.978h5.676c-.245 1.273-1.478 3.743-5.676 3.743-3.417 0-6.193-2.828-6.193-6.317s2.776-6.317 6.193-6.317c1.949 0 3.26.828 4.012 1.545l2.741-2.662c-1.736-1.613-3.984-2.606-6.753-2.606-5.388 0-9.765 4.372-9.765 9.76s4.377 9.76 9.765 9.76c5.627 0 9.354-3.966 9.354-9.56 0-.642-.073-1.134-.162-1.599z"
                  fill="#EA4335"
                />
              </svg>
              LOG IN WITH GOOGLE
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}