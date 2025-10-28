import { z } from 'zod'

export const registerSchema = z
    .object({
        name: z
            .string()
            .min(4, '用户名至少4个字符')
            .max(16, '用户名最多16个字符'),
        email: z.string().pipe(z.email('请输入有效的邮箱地址')),
        password: z.string().min(8, '密码至少8个字符'),
        checkPassword: z.string().min(1, '请确认密码'),
    })
    .refine((data) => data.password === data.checkPassword, {
        message: '两次输入的密码不一致',
        path: ['checkPassword'],
    })


export const loginSchema = z.object({
    email: z.string().pipe(z.email('请输入有效的邮箱地址')),
    password: z.string().min(1, '请输入密码'),
})


export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
