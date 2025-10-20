import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ArrowLeft, Send, Rocket, Code, Eye, Copy, Download, Loader2, User, Bot } from 'lucide-react'
import { toast } from 'sonner'
import { getApp, deployApp, chatToGenCode } from '@/api/yingyongguanli'

interface Message {
    id: string
    type: 'user' | 'assistant'
    content: string
    timestamp: Date
}

export default function ChatPage() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()

    // 应用信息
    const [app, setApp] = useState<API.AppVO | null>(null)
    const [loading, setLoading] = useState(true)

    // 对话相关
    const [messages, setMessages] = useState<Message[]>([])
    const [inputMessage, setInputMessage] = useState('')
    const [isGenerating, setIsGenerating] = useState(false)

    // 代码预览
    const [generatedCode, setGeneratedCode] = useState('')
    const [previewMode, setPreviewMode] = useState<'code' | 'preview'>('code')

    // 部署相关
    const [isDeploying, setIsDeploying] = useState(false)
    const [deployUrl, setDeployUrl] = useState('')

    // 加载应用信息
    useEffect(() => {
        const loadApp = async () => {
            if (!id) return

            try {
                const response = await getApp({ id })
                if (response.data.code === 0) {
                    const data = response.data.data as API.AppVO
                    setApp(data)
                    // 添加初始消息
                    const initialMessage: Message = {
                        id: 'initial',
                        type: 'assistant',
                        content: data?.initPrompt || '你好！我是你的AI助手，请告诉我你想要创建什么样的应用。',
                        timestamp: new Date()
                    }
                    setMessages([initialMessage])
                } else {
                    toast.error('应用不存在或无权限访问')
                    navigate('/app')
                }
            } catch (error) {
                toast.error('加载应用信息失败')
                navigate('/app')
            } finally {
                setLoading(false)
            }
        }

        loadApp()
    }, [id, navigate])

    // 发送消息
    const handleSendMessage = async () => {
        if (!inputMessage.trim() || isGenerating || !id) return

        const userMessage: Message = {
            id: Date.now().toString(),
            type: 'user',
            content: inputMessage.trim(),
            timestamp: new Date()
        }

        setMessages((prev) => [...prev, userMessage])
        const currentMessage = inputMessage.trim()
        setInputMessage('')
        setIsGenerating(true)

        // 添加助手消息占位符
        const assistantMessageId = (Date.now() + 1).toString()
        const assistantMessage: Message = {
            id: assistantMessageId,
            type: 'assistant',
            content: '',
            timestamp: new Date()
        }
        setMessages((prev) => [...prev, assistantMessage])

        try {
            // 使用 chatToGenCode API 方法
            const response = await chatToGenCode({
                appId: id,
                message: currentMessage
            })

            let fullCode = ''
            
            // 处理响应数据 - 由于类型定义问题，需要使用 any 类型
            const responseData = response.data as any
            
            if (responseData) {
                // 如果是数组格式的流式数据
                if (Array.isArray(responseData)) {
                    for (const item of responseData) {
                        if (typeof item === 'string') {
                            // 解析每个数据项，格式可能是 "data:{\"d\":\"文本\"}"
                            if (item.startsWith('data:')) {
                                try {
                                    const jsonStr = item.substring(5) // 移除 "data:" 前缀
                                    const data = JSON.parse(jsonStr)
                                    if (data.d) {
                                        fullCode += data.d
                                    }
                                } catch (error) {
                                    console.error('解析数据项失败:', error, item)
                                }
                            } else {
                                // 如果不是特殊格式，直接添加
                                fullCode += item
                            }
                        }
                    }
                } else if (typeof responseData === 'string') {
                    // 如果是字符串格式，按行分割处理
                    const lines = responseData.split('\n')
                    for (const line of lines) {
                        if (line.startsWith('data:')) {
                            try {
                                const jsonStr = line.substring(5)
                                const data = JSON.parse(jsonStr)
                                if (data.d) {
                                    fullCode += data.d
                                }
                            } catch (error) {
                                console.error('解析数据行失败:', error, line)
                            }
                        }
                    }
                }
            }

            // 更新消息和生成的代码
            if (fullCode) {
                setMessages((prev) =>
                    prev.map((msg) =>
                        msg.id === assistantMessageId
                            ? { ...msg, content: `代码生成完成！\n\n\`\`\`html\n${fullCode}\n\`\`\`` }
                            : msg
                    )
                )
                setGeneratedCode(fullCode)
                toast.success('代码生成完成！')
            } else {
                setMessages((prev) =>
                    prev.map((msg) =>
                        msg.id === assistantMessageId
                            ? { ...msg, content: '代码生成完成，但没有返回内容。' }
                            : msg
                    )
                )
            }
        } catch (error) {
            console.error('发送消息失败:', error)

            // 更新错误消息
            setMessages((prev) =>
                prev.map((msg) =>
                    msg.id === assistantMessageId ? { ...msg, content: '抱歉，发送消息时出现了错误，请重试。' } : msg
                )
            )
            toast.error('发送消息失败')
        } finally {
            setIsGenerating(false)
        }
    }

    // 部署应用
    const handleDeploy = async () => {
        if (!id) {
            toast.error('应用ID不存在')
            return
        }

        if (!generatedCode) {
            toast.error('请先生成代码再进行部署')
            return
        }

        setIsDeploying(true)
        try {
            const response = await deployApp({ appId: id })
            if (response.data.code === 0) {
                const url = response.data.data || ''
                setDeployUrl(url)
                toast.success('部署成功！应用已上线')

                // 添加部署成功的消息到聊天记录
                const deployMessage: Message = {
                    id: Date.now().toString(),
                    type: 'assistant',
                    content: `🎉 应用部署成功！\n\n访问地址：${url}\n\n您的应用已经成功部署并可以在线访问了。`,
                    timestamp: new Date()
                }
                setMessages((prev) => [...prev, deployMessage])
            } else {
                const errorMsg = response.data.message || '部署失败，请重试'
                toast.error(errorMsg)

                // 添加部署失败的消息到聊天记录
                const errorMessage: Message = {
                    id: Date.now().toString(),
                    type: 'assistant',
                    content: `❌ 部署失败：${errorMsg}\n\n请检查应用配置或稍后重试。`,
                    timestamp: new Date()
                }
                setMessages((prev) => [...prev, errorMessage])
            }
        } catch (error) {
            console.error('部署失败:', error)
            const errorMsg = '部署过程中发生错误，请稍后重试'
            toast.error(errorMsg)

            // 添加部署错误的消息到聊天记录
            const errorMessage: Message = {
                id: Date.now().toString(),
                type: 'assistant',
                content: `❌ 部署错误：${errorMsg}\n\n请检查网络连接或联系技术支持。`,
                timestamp: new Date()
            }
            setMessages((prev) => [...prev, errorMessage])
        } finally {
            setIsDeploying(false)
        }
    }

    // 复制代码
    const handleCopyCode = () => {
        navigator.clipboard.writeText(generatedCode)
        toast.success('代码已复制到剪贴板')
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-8 h-8 animate-spin" />
            </div>
        )
    }

    return (
        <div className="h-screen flex flex-col bg-gray-50">
            {/* 顶部栏 */}
            <header className="bg-white border-b px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate('/app')}
                        className="flex items-center gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        返回
                    </Button>
                    <Separator orientation="vertical" className="h-6" />
                    <div>
                        <h1 className="text-lg font-semibold">{app?.appName}</h1>
                        <p className="text-sm text-muted-foreground">{app?.codeGenType || 'html'} 应用</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {deployUrl && (
                        <Button variant="outline" size="sm" onClick={() => window.open(deployUrl, '_blank')}>
                            <Eye className="w-4 h-4 mr-2" />
                            查看部署
                        </Button>
                    )}
                    <Button onClick={handleDeploy} disabled={isDeploying || !generatedCode} size="sm">
                        {isDeploying ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                            <Rocket className="w-4 h-4 mr-2" />
                        )}
                        部署应用
                    </Button>
                </div>
            </header>

            {/* 主要内容区域 */}
            <div className="flex-1 flex">
                {/* 对话区域 */}
                <div className="w-1/2 flex flex-col border-r">
                    {/* 消息列表 */}
                    <ScrollArea className="flex-1 p-4">
                        <div className="space-y-4">
                            {messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={`flex gap-3 ${
                                        message.type === 'user' ? 'justify-end' : 'justify-start'
                                    }`}
                                >
                                    {message.type === 'assistant' && (
                                        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                                            <Bot className="w-4 h-4 text-white" />
                                        </div>
                                    )}
                                    <div
                                        className={`max-w-[80%] rounded-lg px-4 py-2 ${
                                            message.type === 'user' ? 'bg-blue-500 text-white' : 'bg-white border'
                                        }`}
                                    >
                                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                                        <p className="text-xs opacity-70 mt-1">
                                            {message.timestamp.toLocaleTimeString()}
                                        </p>
                                    </div>
                                    {message.type === 'user' && (
                                        <div className="w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center flex-shrink-0">
                                            <User className="w-4 h-4 text-white" />
                                        </div>
                                    )}
                                </div>
                            ))}
                            {isGenerating && (
                                <div className="flex gap-3 justify-start">
                                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                                        <Bot className="w-4 h-4 text-white" />
                                    </div>
                                    <div className="bg-white border rounded-lg px-4 py-2">
                                        <div className="flex items-center gap-2">
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            <span className="text-sm">正在生成代码...</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </ScrollArea>

                    {/* 输入区域 */}
                    <div className="p-4 bg-white border-t">
                        <div className="flex gap-2">
                            <Textarea
                                placeholder="描述你想要的功能..."
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault()
                                        handleSendMessage()
                                    }
                                }}
                                className="flex-1 min-h-[60px] resize-none"
                                disabled={isGenerating}
                            />
                            <Button
                                onClick={handleSendMessage}
                                disabled={!inputMessage.trim() || isGenerating}
                                size="sm"
                                className="self-end"
                            >
                                <Send className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* 预览区域 */}
                <div className="w-1/2 flex flex-col">
                    <div className="p-4 bg-white border-b">
                        <div className="flex items-center justify-between">
                            <Tabs
                                value={previewMode}
                                onValueChange={(value) => setPreviewMode(value as 'code' | 'preview')}
                            >
                                <TabsList>
                                    <TabsTrigger value="code" className="flex items-center gap-2">
                                        <Code className="w-4 h-4" />
                                        代码
                                    </TabsTrigger>
                                    <TabsTrigger value="preview" className="flex items-center gap-2">
                                        <Eye className="w-4 h-4" />
                                        预览
                                    </TabsTrigger>
                                </TabsList>
                            </Tabs>

                            {generatedCode && (
                                <Button variant="outline" size="sm" onClick={handleCopyCode}>
                                    <Copy className="w-4 h-4 mr-2" />
                                    复制代码
                                </Button>
                            )}
                        </div>
                    </div>

                    <div className="flex-1">
                        {previewMode === 'code' ? (
                            <ScrollArea className="h-full">
                                <pre className="p-4 text-sm bg-gray-900 text-gray-100 h-full">
                                    <code>{generatedCode || '// 代码将在这里显示...'}</code>
                                </pre>
                            </ScrollArea>
                        ) : (
                            <div className="h-full bg-white">
                                {generatedCode ? (
                                    <iframe srcDoc={generatedCode} className="w-full h-full border-0" title="预览" />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-muted-foreground">
                                        预览将在代码生成后显示
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
