'use client'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/common/logo";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { loginUserApi } from "@/api/user";
import { useUserStore } from "@/stores";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";

const formSchema = z.object({
  userAccount: z
    .string()
    .min(1, {
      message: "请输入用户名",
    })
    .describe("用户名"),
  userPassword: z
    .string()
    .min(1, {
      message: "请输入密码",
    })
    .describe("密码"),
});

function SignInPage() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userAccount: "",
      userPassword: "",
    },
  });
  const update = useUserStore((state) => state.update);
  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const res = await loginUserApi(values);
    if (res.code === 0) {
      update({ user: res.data, isLogined: true });
      router.push("/");
      return;
    }
    toast(res.message);
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
            <Button className="w-full" type="submit">
              登录
            </Button>
          </form>
        </Form>

        <p className="mt-4 text-center text-sm text-gray-600">
          没有账号？
          <Link href="/sign-up" className="text-blue-600 font-medium">
            注册
          </Link>
        </p>
      </div>
    </div>
  );
}

export default SignInPage;
