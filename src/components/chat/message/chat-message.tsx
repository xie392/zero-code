"use client";

import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import "highlight.js/styles/github-dark.css";

interface ChatMessageProps {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp?: Date | string;
}

export function ChatMessage({ role, content, timestamp }: ChatMessageProps) {
  const isUser = role === "user";
  const isSystem = role === "system";

  return (
    <div
      className={cn(
        "flex",
        isUser ? "justify-end" : isSystem ? "justify-center" : "justify-start"
      )}
    >
      <div
        className={cn(
          "max-w-[80%] rounded-lg px-4 py-2",
          isUser
            ? "bg-blue-500 text-white"
            : isSystem
            ? "bg-yellow-50 text-yellow-800 border border-yellow-200"
            : "bg-gray-100 text-gray-900"
        )}
      >
        {isUser ? (
          <div className="whitespace-pre-wrap break-words text-sm">
            {content}
          </div>
        ) : (
          <div
            className={cn(
              "text-sm",
              "prose prose-sm max-w-none",
              "prose-headings:mt-3 prose-headings:mb-2 prose-headings:text-gray-900",
              "prose-p:my-2 prose-p:text-gray-900",
              "prose-pre:bg-gray-800 prose-pre:text-gray-100 prose-pre:my-2",
              "prose-code:text-blue-600 prose-code:bg-blue-50 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-xs",
              "prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline",
              "prose-ul:my-2 prose-ol:my-2",
              "prose-li:my-1 prose-li:text-gray-900",
              "prose-strong:text-gray-900 prose-strong:font-semibold",
              "prose-blockquote:border-l-blue-500 prose-blockquote:text-gray-700"
            )}
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight, rehypeRaw]}
            >
              {content}
            </ReactMarkdown>
          </div>
        )}
        {timestamp && (
          <div
            className={cn(
              "text-xs mt-1",
              isUser ? "text-blue-100" : "text-gray-500"
            )}
          >
            {new Date(timestamp).toLocaleTimeString("zh-CN", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        )}
      </div>
    </div>
  );
}
