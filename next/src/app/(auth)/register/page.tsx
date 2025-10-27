"use client";
import { AuthForm } from "@/components/auth-form";
import { signUp } from "@/lib/auth-client";
import { z } from "zod";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";

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
  const router = useRouter();
  const params = useSearchParams();
  const redirectPath = useMemo(() => params.get("redirect") ?? "/", [params]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await signUp.email(
      {
        ...values,
        callbackURL: "/", // 用户验证邮箱后重定向的URL（可选）
      },
      {
        onSuccess: () => {
          router.push(redirectPath);
        },
        onError: (ctx) => {
          toast.error(ctx.error.message || "注册失败");
        },
      }
    );
  };

  return (
    <AuthForm
      formSchema={formSchema}
      defaultValues={{
        name: "",
        email: "",
        password: "",
        checkPassword: "",
      }}
      fields={[
        { name: "name", placeholder: "用户名", type: "text" },
        { name: "email", placeholder: "邮箱", type: "email" },
        { name: "password", placeholder: "密码", type: "password" },
        { name: "checkPassword", placeholder: "确认密码", type: "password" },
      ]}
      submitButtonText="注册"
      onSubmit={onSubmit}
      footerLink={{
        text: "已有账号？",
        linkText: "登录",
        href: "/login",
      }}
    />
  );
}
