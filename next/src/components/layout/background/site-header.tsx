'use client'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useUserStore } from '@/stores'

interface SiteHeaderProps {
    title?: string
}

export function SiteHeader({ title }: SiteHeaderProps) {
    const user = useUserStore((state) => state.user)
    const logout = useUserStore((state) => state.logout)

    return (
        <header className="flex h-(--header-height) shrink-0 items-center gap-2 sticky top-0 z-50 bg-background border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
            <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
                <SidebarTrigger className="-ml-1" />
                {title && <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />}
                <h1 className="text-base font-medium">{title}</h1>
                <div className="ml-auto flex items-center gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <Avatar>
                                <AvatarImage src={user?.userAvatar} />
                                <AvatarFallback>{user?.userName?.[0]}</AvatarFallback>
                            </Avatar>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => logout()}>退出登录</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    )
}
