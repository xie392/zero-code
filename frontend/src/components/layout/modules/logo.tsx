import { cn } from '@/lib/utils'
import { Link } from 'react-router-dom'

interface LogoProps extends React.HTMLAttributes<HTMLAnchorElement> {
    className?: string
}

export function Logo({ className, ...props }: LogoProps) {
    return (
        <Link {...props} to="/app">
            <img src="/logo.png" alt="logo" className={cn('w-auto h-6', className)} />
        </Link>
    )
}
