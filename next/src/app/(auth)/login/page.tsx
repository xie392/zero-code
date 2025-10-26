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
import { useUserStore } from "@/stores";

import { signIn } from "@/lib/auth-client";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

const formSchema = z.object({
  email: z.string().pipe(z.email("请输入有效的邮箱地址")),
  password: z.string().min(1, {
    message: "请输入密码",
  }),
});

export default function LoginPage() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const update = useUserStore((state) => state.update);
  const router = useRouter();
  const params = useSearchParams();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await signIn.email(
      {
        ...values,
      },
      {
        onSuccess: (ctx) => {
          update({ user: ctx.data });
          router.push(params.get("redirect") || "/");
        },
        onError: (ctx) => {
          toast.error(ctx.error.message);
        },
      }
    );
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
            <Button className="w-full" type="submit">
              登录
            </Button>
          </form>
        </Form>

        <p className="mt-4 text-center text-sm text-gray-600">
          没有账号？
          <Link href="/register" className="text-blue-600 font-medium">
            注册
          </Link>
        </p>
      </div>
    </div>
  );
}
