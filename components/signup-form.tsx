"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
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
import {
  FormField,
  FormMessage,
  FormItem,
  FormLabel,
  FormControl,
  Form,
} from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { toast } from "sonner"
import { 
  User, 
  Mail, 
  Lock, 
  Globe, 
  MapPin, 
  Shield,
  ArrowRight,
  CheckCircle,
  Users,
  Camera
} from "lucide-react"
import Password from "./Layout/Auth/Password"

const formSchema = z.object({
  name: z.string()
    .min(4, { message: "Name must be at least 4 characters" })
    .max(50, { message: "Name must be less than 50 characters" }),
  email: z.string()
    .email({ message: "Please enter a valid email address" }),
  password: z.string()
    .min(6, { message: "Password must be at least 6 characters" }),
  role: z.enum(["TOURIST", "GUIDE"]),
})

type FormValues = z.infer<typeof formSchema>

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedRole, setSelectedRole] = useState<"TOURIST" | "GUIDE">("GUIDE")

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "TOURIST",
    },
    mode: "onChange",
  })

  // Update form when role changes
  const handleRoleChange = (role: "TOURIST" | "GUIDE") => {
    setSelectedRole(role)
    form.setValue("role", role)
  }

  const onSubmit = async (data: FormValues) => {
    try {
      setIsLoading(true)
      
      console.log("Registration attempt with data:", data)
      
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
      
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const result = await res.json()
      console.log("Registration response:", result)
      
      if (res.ok) {
        toast.success("Account created successfully!")
        
        // Clear any existing tokens
        localStorage.removeItem("accessToken")
        localStorage.removeItem("refreshToken")
        localStorage.removeItem("userRole")
        
        // Wait 1 second then redirect to login
        setTimeout(() => {
          router.push(`/login?email=${encodeURIComponent(data.email)}&registered=true`)
        }, 1000)
        
      } else {
        // Show error message
        const errorMsg = result.message || result.error || "Registration failed"
        toast.error(errorMsg)
      }
    } catch (error: any) {
      console.error("Registration error:", error)
      toast.error("Failed to connect to server. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const RoleCard = ({ 
    role, 
    title, 
    icon: Icon, 
  }: {
    role: "TOURIST" | "GUIDE"
    title: string
    icon: React.ComponentType<any>
  }) => {
    const isSelected = selectedRole === role
    
    return (
      <button
        type="button"
        onClick={() => handleRoleChange(role)}
        className={cn(
          "relative w-full text-left p-6 rounded-xl border-2 transition-all duration-300 hover:border-blue-500 hover:shadow-md",
          isSelected 
            ? "border-blue-500 bg-blue-50" 
            : "border-gray-200 bg-white"
        )}
      >
        {isSelected && (
          <div className="absolute -top-2 -right-2 bg-blue-500 text-white p-1 rounded-full">
            <CheckCircle className="h-5 w-5" />
          </div>
        )}
        
        <div className="flex items-start gap-4">
          <div className={cn(
            "p-3 rounded-lg",
            isSelected ? "bg-blue-100" : "bg-gray-100"
          )}>
            <Icon className={cn(
              "h-6 w-6",
              isSelected ? "text-blue-600" : "text-gray-600"
            )} />
          </div>
          
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-500 mt-1">
              {role === "TOURIST" 
                ? "Book tours & explore destinations" 
                : "Create tours & guide travelers"}
            </p>
          </div>
        </div>
      </button>
    )
  }

  return (
    <div className={cn("w-full max-w-lg mx-auto", className)} {...props}>
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl shadow-lg shadow-blue-500/30 mb-4">
          <Globe className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Create Account
        </h1>
        <p className="text-gray-600">
          Join LocalGuide to explore or guide amazing tours
        </p>
      </div>

      <Card className="border shadow-lg">
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Role Selection */}
              <div className="space-y-3">
                <FormLabel className="text-base font-semibold flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-500" />
                  I want to join as a...
                </FormLabel>
                
                <div className="grid grid-cols-2 gap-3">
                  <RoleCard
                    role="TOURIST"
                    title="Tourist"
                    icon={MapPin}
                  />
                  
                  <RoleCard
                    role="GUIDE"
                    title="Guide"
                    icon={Camera}
                  />
                </div>
                
                <input
                  type="hidden"
                  {...form.register("role")}
                  value={selectedRole}
                />
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                {/* Name Field */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Full Name
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                            <User className="h-5 w-5" />
                          </div>
                          <Input
                            className="pl-10"
                            placeholder="John Doe"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-500 text-sm" />
                    </FormItem>
                  )}
                />

                {/* Email Field */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Email Address
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                            <Mail className="h-5 w-5" />
                          </div>
                          <Input
                            className="pl-10"
                            placeholder="hello@example.com"
                            type="email"
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
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Password
                      </FormLabel>
                      <FormControl>
                        <Password {...field} />
                      </FormControl>
                      <FormMessage className="text-red-500 text-sm" />
                    </FormItem>
                  )}
                />
              </div>

              {/* Terms and Conditions */}
              <div className="text-xs text-gray-500">
                By creating an account, you agree to our{" "}
                <Link href="/terms" className="text-blue-600 hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-blue-600 hover:underline">
                  Privacy Policy
                </Link>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-linear-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-semibold rounded-xl py-7 text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Creating Account...
                  </>
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>

              {/* Login Link */}
              <div className="text-center pt-4 border-t">
                <p className="text-gray-600 text-sm">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="font-semibold text-blue-600 hover:text-blue-700"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Security Note */}
      <div className="mt-6 text-center">
        <p className="text-xs text-gray-500 flex items-center justify-center gap-2">
          <Shield className="h-3 w-3 text-blue-400" />
          Secure registration
          <Shield className="h-3 w-3 text-blue-400" />
        </p>
      </div>
    </div>
  )
}