import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import { IconUser, IconUserCheck } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// import { updateUser } from '@/api/yonghuguanli'

enum UserRole {
  Admin = "admin",
  User = "user",
}

const formSchema = z.object({
  // id: z.string(),
  userName: z
    .string()
    .min(1, "用户名不能为空")
    .max(50, "用户名不能超过50个字符"),
  userAvatar: z.string().optional(),
  userProfile: z.string().max(200, "简介不能超过200个字符").optional(),
  userRole: z.enum(UserRole),
});

type FormValues = z.infer<typeof formSchema>;

interface UserEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: API.UserVO | null;
  onSuccess?: () => void;
}

const roleOptions = [
  { value: "admin", label: "管理员", icon: IconUserCheck },
  { value: "user", label: "普通用户", icon: IconUser },
];

export function UserEditDialog({
  open,
  onOpenChange,
  user,
  onSuccess,
}: UserEditDialogProps) {
  const [loading, setLoading] = React.useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      // id: '',
      userName: "",
      userAvatar: "",
      userProfile: "",
      userRole: UserRole.User,
    },
  });

  // 当用户数据变化时更新表单
  React.useEffect(() => {
    if (user && open) {
      form.reset({
        // id: user.id?.toString() || '',
        userName: user.userName || "",
        userAvatar: user.userAvatar || "",
        userProfile: user.userProfile || "",
        userRole: (user.userRole as UserRole) || UserRole.User,
      });
    }
  }, [user, open, form]);

  const onSubmit = async (values: FormValues) => {
    console.log("提交值:", values);
    setLoading(true);
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
      console.error("更新用户失败:", error);
      toast.error("更新用户失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.reset();
    onOpenChange(false);
  };

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
                  src={form.watch("userAvatar")}
                  alt={form.watch("userName")}
                />
                <AvatarFallback>
                  {form.watch("userName")?.charAt(0)?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
            </div>

            <FormField
              control={form.control}
              name="userName"
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
              name="userAvatar"
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

            <FormField
              control={form.control}
              name="userProfile"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>个人简介</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="请输入个人简介"
                      className="resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="userRole"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>用户角色</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="选择用户角色" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {roleOptions.map((role) => {
                        const Icon = role.icon;
                        return (
                          <SelectItem key={role.value} value={role.value}>
                            <div className="flex items-center">
                              <Icon className="mr-2 h-4 w-4" />
                              {role.label}
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
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
                {loading ? "保存中..." : "保存"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
