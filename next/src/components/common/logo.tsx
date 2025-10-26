import { cn } from '@/lib/utils'
import Link from 'next/link'

interface LogoProps extends React.HTMLAttributes<HTMLAnchorElement> {
  className?: string
}

export function Logo({ className, ...props }: LogoProps) {
  return (
    <Link {...props} href="/app">
      <img
        src="/logo.png"
        alt="logo"
        className={cn('w-auto h-4.5', className)}
      />
    </Link>
  )
}
