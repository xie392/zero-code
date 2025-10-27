'use client'
// import Image from "next/image";
// import { loginUserInfoApi } from "@/api/user";
// import { useQuery } from "@tanstack/react-query";
// import { ChatInput } from "@/components/chat/input";
import { AppHeroInput } from '@/components/hero/app-hero-input'
import { AppList } from '@/components/app-list/app-list'
import { cn } from '@/lib/utils'

export default function Home() {
  //   const { data, isLoading, isError } = useQuery({
  //     queryKey: ["loginUserInfo"],
  //     queryFn: loginUserInfoApi,
  //   });
  return (
    <div className="min-h-screen">
      <div
        className={cn(
          'fixed top-0 -z-10 h-screen w-full',
          'bg-gradient-to-b from-white via-blue-50 to-indigo-100',
          'dark:from-slate-900 dark:via-blue-900 dark:to-indigo-900',
        )}
      ></div>
      <main>
        <AppHeroInput />
        <AppList />
      </main>
    </div>
  )
}
