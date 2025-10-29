
import type { User } from 'better-auth/types'

export declare global {
  export interface LayoutRootProps extends Readonly<{
    children: React.ReactNode
  }> { }

  export interface CtxContext {
    req: Request
    res: Headers
  }

  export interface AuthResponse {
    user: User
  }
}
