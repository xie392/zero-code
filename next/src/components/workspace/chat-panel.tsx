"use client";

import { useState, useRef, useEffect } from "react";
import type { ChatMessage } from "@/types/project";
import { ChatMessage as ChatMessageComponent } from "@/components/chat/message/chat-message";
import { BaseChatInput } from "@/components/chat/input/base-chat-input";
import { useStreamGenerate } from "@/hooks/use-stream-generate";

interface ChatPanelProps {
  projectId: string
  initialMessages: ChatMessage[]
  onNewHtml: (html: string) => void
}

export function ChatPanel({
  projectId,
  initialMessages,
  onNewHtml,
}: ChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const assistantContentRef = useRef("");

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const { generate, isGenerating } = useStreamGenerate({
    onChunk: (content) => {
      assistantContentRef.current += content;
      setMessages((prev) => {
        const newMessages = [...prev];
        const lastMsg = newMessages[newMessages.length - 1];
        if (lastMsg?.role === "assistant") {
          lastMsg.content = assistantContentRef.current;
        }
        return newMessages;
      });
    },
    onHtml: (html) => {
      onNewHtml(html);
    },
    onComplete: (data) => {
      if (data.htmlContent) {
        onNewHtml(data.htmlContent);
      }
    },
    onError: (error) => {
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        projectId,
        role: "assistant",
        content: `抱歉，生成失败了: ${error}`,
        createdAt: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    },
  });

  const handleSend = async (message: string) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      projectId,
      role: "user",
      content: message,
      createdAt: new Date(),
    };

    const assistantMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      projectId,
      role: "assistant",
      content: "",
      createdAt: new Date(),
    };

    setMessages((prev) => [...prev, userMessage, assistantMessage]);
    assistantContentRef.current = "";

    try {
      await generate(message, projectId);
    } catch (error) {
      console.error("发送消息失败:", error);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* 标题栏 */}
      <div className="px-4 py-3 border-b bg-gray-50">
        <h2 className="text-sm font-semibold text-gray-700">对话</h2>
      </div>

      {/* 消息列表 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <ChatMessageComponent
            key={message.id}
            role={message.role}
            content={message.content}
            timestamp={message.createdAt}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* 输入框 */}
      <div className="border-t p-4 bg-gray-50">
        <BaseChatInput
          onSend={handleSend}
          isLoading={isGenerating}
          placeholder="输入修改需求..."
        />
      </div>
    </div>
  );
}
