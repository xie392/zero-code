import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { EyeIcon, ThumbsUpIcon } from "lucide-react";

export function AppItem() {
  return (
    <div className="group w-full">
      {/* 图片容器 */}
      <div className="relative h-64 w-full cursor-pointer overflow-hidden rounded-xl bg-slate-200">
        <img
          src="https://picsum.photos/600/300"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          alt=""
        />
        {/* 悬浮按钮层 */}
        <div className="absolute inset-0 flex flex-col justify-end bg-black/30 p-4 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
          <div className="flex gap-4 translate-y-4 transition-transform duration-500 group-hover:translate-y-0">
            <Button className="flex-1">访问</Button>
            <Button className="flex-1" variant="outline">详情</Button>
          </div>
        </div>
      </div>

      {/* 内容区 */}
      <div className="space-y-2 py-4">
        <h3 className="truncate font-semibold text-slate-900 dark:text-white" title="应用名称">
          应用名称
        </h3>
        
        {/* 作者与统计行 */}
        <div className="flex items-center justify-between">
          {/* 作者信息 */}
          <div className="flex min-w-0 items-center gap-2">
            <Avatar className="size-6 shrink-0">
              <AvatarImage src="https://picsum.photos/100" alt="avatar" />
              <AvatarFallback className="text-xs">中</AvatarFallback>
            </Avatar>
            <span className="min-w-0 flex-1 truncate text-sm text-slate-600 dark:text-slate-300" title="中分银发帅哥">
              中分银发帅哥
            </span>
          </div>
          
          {/* 统计信息 */}
          <div className="flex items-center gap-6 text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1">
              <EyeIcon className="size-4" />
              <span className="text-sm">39.9K</span>
            </div>
            <div className="flex items-center gap-1">
              <ThumbsUpIcon className="size-4" />
              <span className="text-sm">1.1K</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
