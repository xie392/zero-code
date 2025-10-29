'use client'

import { Button } from '@/components/ui/button'
import { Logo } from '@/components/common/logo'
import { cn } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

import Link from 'next/link'
import { Home, Info, AppWindowMac } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { useSession, signOut } from '@/server/auth/auth-client'

interface NavigationItem {
  name: string
  path: string
  icon: React.ComponentType<{ className?: string }>
}

const navigationItems: NavigationItem[] = [
  // { name: "首页", path: "/", icon: Home },
  // { name: "应用", path: "/apps", icon: AppWindowMac },
  // { name: "关于", path: "/about", icon: Info },
]

export function SiteAppHeader() {
  const location = usePathname()
  const router = useRouter()

  const isActiveRoute = (path: string) => path === location

  const { data: session } = useSession()

  const logout = async () => {
    await signOut()
    router.push('/login')
  }

  return (
    <header className="w-full h-14 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-200/20 dark:border-gray-700/20 sticky top-0 z-50">
      <div className="mx-auto h-full flex items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo />

        <nav className="hidden md:flex items-center space-x-8 flex-1 ml-10">
          {navigationItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={cn(
                'flex items-center space-x-1.5 text-sm font-medium transition-colors text-gray-400',
                isActiveRoute(item.path)
                  ? 'text-primary/90'
                  : 'hover:text-primary/90',
              )}
            >
              <item.icon className="size-4 mr-1.5" />
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center space-x-4">
          {!session?.user ? (
            <Button
              size="sm"
              className="h-8"
              onClick={() => router.push('/login')}
            >
              登录
            </Button>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar>
                  <AvatarImage src={session?.user?.image || ''} />
                  <AvatarFallback>{session?.user?.name?.[0]}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <Link href="/user-profile">用户信息</Link>
                </DropdownMenuItem>
                {/* {session?.user?.role === "admin" && (
                  <>
                    <DropdownMenuItem>
                      <Link href="/admin">后台管理</Link>
                    </DropdownMenuItem>
                  </>
                )} */}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => logout()}>
                  退出登录
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  )
}
