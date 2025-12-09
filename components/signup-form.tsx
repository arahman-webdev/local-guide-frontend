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

// import config from "@/config"


const formSchema = z.object({
  name: z.string().min(4, {
    message: "Username must be at least 4 characters.",
  }),
  email: z.email().min(4, { message: "Email must be at least 4 charecter" }).max(50),
  password: z.string().min(6, { error: "Password must be at least 6 charecter" }),
  role: z.enum(["TOURIST", "GUIDE"])
  // confirmPassword: z.string().min(6, { error: "Confirm Password must be at least 6 charecter" }),

})

// .refine((data) => data.password === data.confirmPassword, {
//   message: "Password do not match",
//   path: ["confirmPassword"]




export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {

  const router = useRouter()


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",


    }
  })


  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(data),
        cache: "no-store",
      });

      const result = await res.json();
      console.log("from result", result);

      if (result.status || result.success) {
        toast.success(result.message);
        router.push('/login')
      } else if (!result.success) {
        // Handle error returned from backend
        const errorMessage = result?.message || "Something went wrong";
        toast.error(errorMessage);
      }
    } catch (error: any) {
      console.log(error);
      toast.error("Failed to register in user");
    }
  };


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
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Name</FormLabel>
                      <FormControl>
                        <Input className="rounded-none p-6" placeholder="Abdur Rahman" type="text" {...field} />
                      </FormControl>
                      <FormDescription className="sr-only">
                        This is your public display name.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input className="rounded-none p-6" placeholder="arahman@gmail.com" type="email" {...field} />
                      </FormControl>
                      <FormDescription className="sr-only">
                        This is your public display name.
                      </FormDescription>
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
                        <Password {...field} />
                      </FormControl>
                      <FormDescription className="sr-only">
                        This is your public display name.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Password {...field} />
                      </FormControl>
                      <FormDescription className="sr-only">
                        This is your public display name.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                /> */}
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl className="w-full rounded-none p-5">
                          <SelectTrigger>
                            <SelectValue placeholder="Select a role to display" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="TOURIST">TOURIST</SelectItem>
                          <SelectItem value="GUIDE">GUIDE</SelectItem>

                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full bg-[#373DD2] hover:bg-[#373cd2e0] text-white font-semibold rounded-full py-2 text-base"
                >
                  Sign Up

                </Button>
              </form>
            </Form>

            <div className="text-center text-sm">
              Do you have an account?{" "}
              <Link href={'/login'} className="underline underline-offset-4">
                Log In
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
            // onClick={() => window.open(`${config.baseUrl}/auth/google`)}
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