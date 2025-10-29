import { TRPCError } from '@trpc/server'
import { publicProcedure, router } from '../trpc'
import { registerSchema, loginSchema } from '../schemas/auth.schema'
import { auth } from '@/server/auth/auth'

function handleAuthResponse(
  response: AuthResponse | null,
  headers: Headers,
  ctx: CtxContext,
  errorMessage: string,
) {
  if (!response) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: errorMessage,
    })
  }

  const setCookie = headers.get('set-cookie')
  if (setCookie) {
    ctx.res.set('set-cookie', setCookie)
  }

  return {
    success: true,
    message: '操作成功',
    user: response.user,
  }
}

export const authRouter = router({
  register: publicProcedure
    .input(registerSchema)
    .mutation(async ({ input, ctx }) => {
      if (input.password !== input.checkPassword) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: '两次输入的密码不一致',
        })
      }

      const { response, headers } = await auth.api.signUpEmail({
        body: input,
        headers: ctx.req.headers,
        returnHeaders: true,
      })
      return handleAuthResponse(response, headers, ctx, '注册失败，请稍后重试')
    }),

  login: publicProcedure.input(loginSchema).mutation(async ({ input, ctx }) => {
    const { response, headers } = await auth.api.signInEmail({
      body: input,
      headers: ctx.req.headers,
      returnHeaders: true,
    })
    return handleAuthResponse(
      response,
      headers,
      ctx,
      '登录失败，请检查邮箱和密码',
    )
  }),
})
