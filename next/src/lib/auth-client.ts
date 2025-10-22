import { createAuthClient } from 'better-auth/react'

export const { signIn, signUp, useSession } = createAuthClient({
  /** 服务器的基础 URL（如果您使用相同域名，则可选） */
  //   baseURL: 'http://localhost:3000',
})
