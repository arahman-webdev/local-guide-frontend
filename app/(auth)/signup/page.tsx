import { RegisterForm } from "@/components/signup-form";
import { Metadata } from "next";
import { Suspense } from "react";



export const metadata:Metadata = {
title: 'Sign up | LocalGuide',
  description: 'Sing up to LocalGuide, explore settings, preferences, and personal information. And enjoy all of our services',
}

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-md">
        <Suspense>
          <RegisterForm />
        </Suspense>
       
      </div>
    </div>
  )
}
