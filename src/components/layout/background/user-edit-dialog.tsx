import * as React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

// import { updateUser } from '@/api/yonghuguanli'

const formSchema = z.object({
  name: z.string().min(1, '用户名不能为空').max(50, '用户名不能超过50个字符'),
  email: z.string().email('请输入有效的邮箱地址'),
  image: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

interface UserEditDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: API.User | null
  onSuccess?: () => void
}

export function UserEditDialog({
  open,
  onOpenChange,
  user,
  onSuccess,
}: UserEditDialogProps) {
  const [loading, setLoading] = React.useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      image: '',
    },
  })

  // 当用户数据变化时更新表单
  React.useEffect(() => {
    if (user && open) {
      form.reset({
        name: user.name || '',
        email: user.email || '',
        image: user.image || '',
      })
    }
  }, [user, open, form])

  const onSubmit = async (values: FormValues) => {
    console.log('提交值:', values)
    setLoading(true)
    try {
      // const response = await updateUser({
      //     ...values,
      //     id: user?.id
      // })
      // if (response.data?.code === 0) {
      //     toast.success('用户信息更新成功')
      //     onOpenChange(false)
      //     onSuccess?.()
      // } else {
      //     toast.error(response.data?.message || '更新失败')
      // }
    } catch (error) {
      console.error('更新用户失败:', error)
      toast.error('更新用户失败，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    form.reset()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>编辑用户</DialogTitle>
          <DialogDescription>修改用户的基本信息和权限设置。</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* 用户头像预览 */}
            <div className="flex justify-center">
              <Avatar className="h-16 w-16">
                <AvatarImage
                  src={form.watch('image') || undefined}
                  alt={form.watch('name')}
                />
                <AvatarFallback>
                  {form.watch('name')?.charAt(0)?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
            </div>

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>用户名</FormLabel>
                  <FormControl>
                    <Input placeholder="请输入用户名" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>邮箱</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="请输入邮箱" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>头像URL</FormLabel>
                  <FormControl>
                    <Input placeholder="请输入头像URL" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={loading}
              >
                取消
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? '保存中...' : '保存'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
