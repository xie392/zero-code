import { ChatInput } from "@/components/chat/input";

export function AppHeroInput() {
  return (
    <div className="pt-20 flex flex-col items-center px-4">
      <h1 className="text-3xl mb-3 font-bold bg-gradient-to-r from-blue-500 via-green-500 to-yellow-500 bg-clip-text text-transparent">
        一句话 · 星所想
      </h1>
      <p className="text-muted-foreground mb-5">与 AI 对话轻松创建应用和网站</p>
      <ChatInput />
    </div>
  );
}
