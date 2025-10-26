'use client'
import { useUserStore } from '@/stores'
import { redirect, usePathname } from 'next/navigation'
import { useEffect } from 'react'

const WHITE_LIST = ['/login', '/register', '/', '/about']

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode
}) {
  // const pathname = usePathname()
  // const isLogined = useUserStore((state) => state.isLogined)
  // const reset = useUserStore((state) => state.reset)

  // useEffect(() => {
  //   if (!isLogined && !WHITE_LIST.includes(pathname)) {
  //     reset()
  //     redirect('/login')
  //   }
  // }, [isLogined, pathname])

  return children
}
