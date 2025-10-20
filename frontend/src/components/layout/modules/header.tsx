import { Button } from '@/components/ui/button'
import { Logo } from './logo'
import { Link, useLocation, useNavigate } from 'react-router-dom'
// Menu,
import { Home, Info } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useUserStore } from '@/stores/user'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

// 导航菜单项
const navigationItems = [
    { name: '首页', path: '/app', icon: Home },
    { name: '关于', path: '/app/about', icon: Info }
]

export function Header() {
    const loc = useLocation()
    const nav = useNavigate()

    const isActiveRoute = (path: string) => path === loc.pathname

    const isLogined = useUserStore((state) => state.isLogined)
    const user = useUserStore((state) => state.user)
    const logout = useUserStore((state) => state.logout)

    return (
        <header className="w-full h-14 bg-white dark:bg-slate-900 bg-opacity-85 sticky top-0 z-50">
            <div className="mx-auto h-full flex items-center justify-between px-4 sm:px-6 lg:px-8">
                <Logo />

                <nav className="hidden md:flex items-center space-x-8 flex-1 ml-10">
                    {navigationItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={cn(
                                'flex items-center space-x-1.5 text-sm font-medium transition-colors text-gray-400',
                                isActiveRoute(item.path) ? 'text-primary/90' : 'hover:text-primary/90'
                            )}
                        >
                            {item.name}
                        </Link>
                    ))}
                </nav>

                <div className="flex items-center space-x-4">
                    {!isLogined ? (
                        <Button size="sm" className="h-8" onClick={() => nav('/auth/sign-in')}>
                            登录
                        </Button>
                    ) : (
                        <DropdownMenu>
                            <DropdownMenuTrigger>
                                <Avatar>
                                    <AvatarImage src={user?.userAvatar} />
                                    <AvatarFallback>{user?.userName?.[0]}</AvatarFallback>
                                </Avatar>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem>
                                    <Link to="/app/user-profile">用户信息</Link>
                                </DropdownMenuItem>
                                {user?.userRole === 'admin' && (
                                    <>
                                        <DropdownMenuItem>
                                            <Link to="/admin">后台管理</Link>
                                        </DropdownMenuItem>
                                    </>
                                )}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => logout()}>退出登录</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>
            </div>
        </header>
    )
}
