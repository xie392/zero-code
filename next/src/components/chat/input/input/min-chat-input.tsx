"use client";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface MinChatInputProps
  extends Omit<React.ComponentProps<"textarea">, "value" | "onChange"> {
  value: string;
  onChange?: (value: string) => void;
}

export function MinChatInput({
  value,
  onChange,
  className,
  placeholder = "一句话做网站、小程序、H5、提效工具、小游戏，你可以通过@来调用插件，为应用拓展多种能力～",
  ...props
}: MinChatInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange?.(e.target.value);
  };

  return (
    <Textarea
      value={value}
      onChange={handleChange}
      className={cn("min-h-32 max-h-64 border-none outline-none", className)}
      placeholder={placeholder}
      {...props}
    />
  );
}
