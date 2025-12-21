import { LoginForm } from "@/components/login-form"
import { Metadata } from "next"


export const metadata:Metadata = {
title: 'Login | LocalGuide',
  description: 'Login your LocalGuide page, explore settings, preferences, and personal information. And see all of your pages',
}

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  )
}
