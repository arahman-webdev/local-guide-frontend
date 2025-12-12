"use client";

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { FormField, FormMessage, FormItem, FormLabel, FormControl, Form } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import Password from "./Layout/Auth/Password"
import Link from "next/link"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { 
  LogIn, 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  Globe, 
  Sparkles,
  User,
  Shield,
  MapPin
} from "lucide-react"

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
})

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    }
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true)
      console.log('Login attempt with:', values.email)
      
      // Call backend login
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: values.email,
          password: values.password
        })
      })

      const data = await response.json()
      console.log('Login response:', data)

      if (data.status && data.data?.accessToken) {
        // Store tokens in localStorage
        localStorage.setItem('accessToken', data.data.accessToken)
        localStorage.setItem('refreshToken', data.data.refreshToken || '')
        localStorage.setItem('userRole', data.data.user?.role || 'TOURIST')
        localStorage.setItem('user', JSON.stringify(data.data.user || {}))
        localStorage.setItem('loginTime', Date.now().toString())
        
        // Also store in sessionStorage for immediate access
        sessionStorage.setItem('token', data.data.accessToken)
        sessionStorage.setItem('userRole', data.data.user?.role || 'TOURIST')

        toast.success(data.message || "Welcome back! Login successful!")
        
        // Wait a moment to ensure storage is set before redirect
        await new Promise(resolve => setTimeout(resolve, 100))
        
        // Redirect based on user role
        const userRole = data.data.user?.role || 'TOURIST'
        
        let redirectUrl = '/dashboard'
        switch(userRole.toUpperCase()) {
          case 'ADMIN':
            redirectUrl = '/dashboard/admin'
            break
          case 'GUIDE':
            redirectUrl = '/dashboard/guide'
            break
          case 'TOURIST':
            redirectUrl = '/dashboard/profile'
            break
        }
        
        console.log('Redirecting to:', redirectUrl)
        window.location.href = redirectUrl
        
      } else {
        const errorMessage = data.message || "Login failed. Please check your credentials."
        toast.error(errorMessage)
      }
    } catch (error: any) {
      console.error('Login error:', error)
      
      if (error.name === 'TypeError' || error.message.includes('Failed to fetch')) {
        toast.error("Cannot connect to server. Please check your internet connection.")
      } else {
        toast.error("An unexpected error occurred. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn("w-full", className)} {...props}>
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-linear-to-r from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-linear-to-r from-cyan-500/10 to-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-linear-to-r from-blue-400/5 to-cyan-400/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-md mx-auto">
        {/* Welcome Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-br from-blue-500 to-cyan-500 rounded-2xl shadow-lg shadow-blue-500/30 mb-6">
            <Globe className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-linear-to-r from-blue-600 to-cyan-500 mb-3">
            Welcome Back
          </h1>
          <p className="text-gray-600">
            Sign in to continue your journey with local guides
          </p>
        </div>

        {/* Login Card */}
        <Card className="border-0 shadow-2xl shadow-blue-500/10 bg-white/95 backdrop-blur-sm">
          <CardHeader className="space-y-2 pb-6">
            <CardTitle className="text-2xl font-bold text-center text-gray-900">
              Login to Your Account
            </CardTitle>
            <CardDescription className="text-center text-gray-600">
              Enter your credentials to access your dashboard
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Email Field */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Email Address
                      </FormLabel>
                      <FormControl>
                        <div className="relative group">
                          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                            <User className="h-5 w-5" />
                          </div>
                          <Input
                            className="pl-12 pr-4 py-6 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 group-hover:border-blue-300"
                            placeholder="hello@example.com"
                            type="email"
                            disabled={isLoading}
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-500 text-sm" />
                    </FormItem>
                  )}
                />
                
                {/* Password Field */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <Lock className="h-4 w-4" />
                        Password
                      </FormLabel>
                      <FormControl>
                        <div className="relative group">
                          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                            <Shield className="h-5 w-5" />
                          </div>
                          <Input
                            className="pl-12 pr-12 py-6 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 group-hover:border-blue-300"
                            placeholder="Enter your password"
                            type={showPassword ? "text" : "password"}
                            disabled={isLoading}
                            {...field}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-500 transition-colors"
                          >
                            {showPassword ? (
                              <EyeOff className="h-5 w-5" />
                            ) : (
                              <Eye className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-500 text-sm" />
                      <div className="flex justify-end">
                        <Link
                          href="/forgot-password"
                          className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                        >
                          Forgot Password?
                        </Link>
                      </div>
                    </FormItem>
                  )}
                />

                {/* Login Button */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-linear-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-semibold rounded-xl py-7 text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-3">
                      <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Signing in...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-3">
                      <LogIn className="h-5 w-5" />
                      <span>Sign In</span>
                    </div>
                  )}
                </Button>
              </form>
            </Form>

            {/* Divider */}
            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
            
            </div>

         
            

            {/* Sign Up Link */}
            <div className="text-center  border-gray-100">
              <p className="text-gray-600">
                New to our platform?{" "}
                <Link
                  href="/signup"
                  className="font-semibold text-blue-600 hover:text-blue-700 underline underline-offset-4 transition-colors"
                >
                  Create an account
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Security Note */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500 flex items-center justify-center gap-2">
            <Sparkles className="h-3 w-3 text-blue-400" />
            Your security is our priority. All data is encrypted and protected.
            <Sparkles className="h-3 w-3 text-blue-400" />
          </p>
        </div>
      </div>
    </div>
  )
}