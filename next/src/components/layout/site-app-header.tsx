"use client";

import { Button } from "@/components/ui/button";
import { Logo } from "@/components/common/logo";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUserStore } from "@/stores";

import Link from "next/link";
import { Home, Info, AppWindowMac } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

const navigationItems = [
  { name: "首页", path: "/", icon: Home },
  { name: "应用", path: "/apps", icon: AppWindowMac },
  { name: "关于", path: "/about", icon: Info },
];

export function SiteAppHeader() {
  const location = usePathname();
  const router = useRouter();

  const isActiveRoute = (path: string) => path === location;

  const isLogined = useUserStore((state) => state.isLogined);
  const user = useUserStore((state) => state.user);
  const logout = useUserStore((state) => state.logout);
  return (
    <header className="w-full h-14 bg-white dark:bg-slate-900 bg-opacity-85 sticky top-0 z-50">
      <div className="mx-auto h-full flex items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo />

        <nav className="hidden md:flex items-center space-x-8 flex-1 ml-10">
          {navigationItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={cn(
                "flex items-center space-x-1.5 text-sm font-medium transition-colors text-gray-400",
                isActiveRoute(item.path)
                  ? "text-primary/90"
                  : "hover:text-primary/90"
              )}
            >
              <item.icon className="size-4 mr-1.5"  />
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center space-x-4">
          {!isLogined ? (
            <Button
              size="sm"
              className="h-8"
              onClick={() => router.push("/login")}
            >
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
                  <Link href="/user-profile">用户信息</Link>
                </DropdownMenuItem>
                {user?.userRole === "admin" && (
                  <>
                    <DropdownMenuItem>
                      <Link href="/admin">后台管理</Link>
                    </DropdownMenuItem>
                  </>
                )}
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
  );
}
