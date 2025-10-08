import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Link, useNavigate } from 'react-router-dom'
import { Logo } from '@/components/layout/modules/logo'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { register } from '@/api/yonghuguanli'
import { toast } from 'sonner'

const formSchema = z
    .object({
        userAccount: z
            .string()
            .min(4, {
                message: '用户名至少4个字符'
            })
            .max(16, {
                message: '用户名最多16个字符'
            })
            .describe('用户名'),
        userPassword: z
            .string()
            .min(8, {
                message: '密码至少8个字符'
            })
            .describe('密码'),
        checkPassword: z
            .string()
            .min(1, {
                message: '请确认密码'
            })
            .describe('确认密码')
    })
    .refine((data) => data.userPassword === data.checkPassword, {
        message: '两次输入的密码不一致',
        path: ['checkPassword']
    })

function SignUpPage() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            userAccount: '',
            userPassword: '',
            checkPassword: ''
        }
    })
    const navigate = useNavigate()

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const res = await register(values)
            if (res.data.code === 0) {
                toast.success('注册成功！请登录')
                navigate('/auth/sign-in')
                return
            }
            toast.error(res.data.message || '注册失败')
        } catch (error: any) {
            toast.error(error?.message || '注册失败，请稍后重试')
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-10">
            <div className="w-full shadow-md p-4 max-w-md">
                <div className="flex justify-center mb-8">
                    <Logo />
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="userAccount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input placeholder="用户名" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="userPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input placeholder="密码" type="password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="checkPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input placeholder="确认密码" type="password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button className="w-full" type="submit">
                            注册
                        </Button>
                    </form>
                </Form>

                <p className="mt-4 text-center text-sm text-gray-600">
                    已有账号？
                    <Link to="/auth/sign-in" className="text-blue-600 font-medium">
                        登录
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default SignUpPage
