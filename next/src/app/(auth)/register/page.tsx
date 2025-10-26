"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/common/logo";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import { signUp } from "@/lib/auth-client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from 'next/navigation'

const formSchema = z
  .object({
    name: z
      .string()
      .min(4, {
        message: "用户名至少4个字符",
      })
      .max(16, {
        message: "用户名最多16个字符",
      }),
    email: z.string().pipe(z.email("请输入有效的邮箱地址")),
    password: z
      .string()
      .min(8, {
        message: "密码至少8个字符",
      })
      .describe("密码"),
    checkPassword: z
      .string()
      .min(1, {
        message: "请确认密码",
      })
      .describe("确认密码"),
  })
  .refine((data) => data.password === data.checkPassword, {
    message: "两次输入的密码不一致",
    path: ["checkPassword"],
  });

export default function RegisterPage() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      checkPassword: "",
    },
  });

  const router = useRouter()

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const { data, error } = await signUp.email({
      ...values,
      callbackURL: "/", // 用户验证邮箱后重定向的URL（可选）
    });
    if (error) {
      toast(error.message || "注册失败");
      return;
    }
    router.push('/')
    console.log("注册成功", data);
    return;
  };

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
              name="name"
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
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="邮箱" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
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
          <Link href="/login" className="text-blue-600 font-medium">
            登录
          </Link>
        </p>
      </div>
    </div>
  );
}

