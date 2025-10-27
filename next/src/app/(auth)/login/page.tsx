"use client";
import { AuthForm } from "@/components/auth-form";
import { signIn } from "@/lib/auth-client";
import { z } from "zod";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";

const formSchema = z.object({
  email: z.string().pipe(z.email("请输入有效的邮箱地址")),
  password: z.string().min(1, {
    message: "请输入密码",
  }),
});

export default function LoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const redirectPath = useMemo(() => params.get("redirect") ?? "/", [params]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await signIn.email(
      {
        ...values,
      },
      {
        onSuccess: () => {
          router.push(redirectPath);
        },
        onError: (ctx) => {
          toast.error(ctx.error.message);
        },
      }
    );
  };

  return (
    <AuthForm
      formSchema={formSchema}
      defaultValues={{
        email: "",
        password: "",
      }}
      fields={[
        { name: "email", placeholder: "邮箱", type: "email" },
        { name: "password", placeholder: "密码", type: "password" },
      ]}
      submitButtonText="登录"
      onSubmit={onSubmit}
      footerLink={{
        text: "没有账号？",
        linkText: "注册",
        href: "/register",
      }}
    />
  );
}
