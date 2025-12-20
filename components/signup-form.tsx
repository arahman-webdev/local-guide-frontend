"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  FormDescription,
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
  Sparkles,
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
  role: z.enum(["TOURIST", "GUIDE"], 
    
  ),
})

type FormValues = z.infer<typeof formSchema>

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  
  // Get role from URL parameter
  const roleParam = searchParams.get("role") as "TOURIST" | "GUIDE" | null
  const defaultRole = roleParam && ["TOURIST", "GUIDE"].includes(roleParam) 
    ? roleParam 
    : undefined

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: defaultRole,
    },
    mode: "onChange",
  })

  // Update form when URL parameter changes
  useEffect(() => {
    if (roleParam && ["TOURIST", "GUIDE"].includes(roleParam)) {
      form.setValue("role", roleParam)
      
      // Update URL to reflect the role
      const newUrl = new URL(window.location.href)
      newUrl.searchParams.set("role", roleParam)
      window.history.replaceState({}, "", newUrl.toString())
    }
  }, [roleParam, form])

  const handleRoleChange = (role: "TOURIST" | "GUIDE") => {
    form.setValue("role", role)
    
    // Update URL with selected role
    const newUrl = new URL(window.location.href)
    newUrl.searchParams.set("role", role)
    router.replace(newUrl.toString(), { scroll: false })
  }

  const onSubmit = async (data: FormValues) => {
    try {
      setIsLoading(true)
      
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const result = await res.json()
      
      if (res.ok && result.success) {
        toast.success(result.message || "Account created successfully!")
        toast.info("Please check your email to verify your account")
        router.push(`/login?role=${data.role.toLowerCase()}`)
      } else {
        toast.error(result.message || "Registration failed. Please try again.")
      }
    } catch (error: any) {
      console.error("Registration error:", error)
      toast.error(error.message || "Failed to create account. Please check your connection.")
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
    const isSelected = form.watch("role") === role
    
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
            
            
           
          </div>
        </div>
      </button>
    )
  }

  return (
    <div className={cn("w-full", className)} {...props}>
      {/* Decorative Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl shadow-lg shadow-blue-500/30 mb-6">
            <Globe className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500 mb-3">
            Join LocalGuide
          </h1>
      
        </div>

        {/* Main Card */}
        <Card className="border-0 shadow-2xl shadow-blue-500/10 bg-white/95 backdrop-blur-sm">
          <CardHeader className="space-y-2 ">
            <CardTitle className="text-2xl font-bold text-center text-gray-900">
              Create Your Account
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Role Selection */}
                <div className="space-y-4">
                  <FormLabel className="text-base font-semibold flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-500" />
                    I want to join as a...
                  </FormLabel>
                  
                  <button className="grid md:grid-cols-2 gap-4" type="button">
                    <RoleCard
                    
                      role="TOURIST"
                      title="Tourist"
                     
                      icon={MapPin}
                   
                    />
                    
                    <RoleCard
                      role="GUIDE"
                      title="Local Guide"
                     
                      icon={Camera}
                 
                    />
                  </button>
                  
                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem className="hidden">
                        <FormControl>
                          <Select 
                            onValueChange={(value) => {
                              field.onChange(value)
                              handleRoleChange(value as "TOURIST" | "GUIDE")
                            }} 
                            value={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="TOURIST">Tourist</SelectItem>
                              <SelectItem value="GUIDE">Guide</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Form Fields */}
                <div className="space-y-4">
                  {/* Name Field */}
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <User className="h-4 w-4" />
                          Full Name
                        </FormLabel>
                        <FormControl>
                          <div className="relative group">
                            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                              <User className="h-5 w-5" />
                            </div>
                            <Input
                              className="pl-12 pr-4 py-6 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 group-hover:border-blue-300"
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
                      <FormItem className="space-y-2">
                        <FormLabel className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          Email Address
                        </FormLabel>
                        <FormControl>
                          <div className="relative group">
                            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                              <Mail className="h-5 w-5" />
                            </div>
                            <Input
                              className="pl-12 pr-4 py-6 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 group-hover:border-blue-300"
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
                      <FormItem className="space-y-2">
                        <FormLabel className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <Lock className="h-4 w-4" />
                        Password
                      </FormLabel>
               
                       <Password {...field} />
                        <FormMessage className="text-red-500 text-sm" />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Terms and Conditions */}
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border">
                  <CheckCircle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-600">
                    By creating an account, you agree to our{" "}
                    <Link href="/terms" className="text-blue-600 hover:underline font-medium">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-blue-600 hover:underline font-medium">
                      Privacy Policy
                    </Link>
                  </p>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-semibold rounded-xl py-7 text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-3">
                      <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Creating Account...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-3">
                      <span>Create Account</span>
                      <ArrowRight className="h-5 w-5" />
                    </div>
                  )}
                </Button>
              </form>
            </Form>

            {/* Login Link */}
            <div className="text-center pt-4 border-t border-gray-200">
              <p className="text-gray-600">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-semibold text-blue-600 hover:text-blue-700 underline underline-offset-4 transition-colors"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Security Note */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500 flex items-center justify-center gap-2">
            <Shield className="h-3 w-3 text-blue-400" />
            Your information is secured with 256-bit SSL encryption
            <Shield className="h-3 w-3 text-blue-400" />
          </p>
        </div>
      </div>
    </div>
  )
}