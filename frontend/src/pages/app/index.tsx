
import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { getFeaturedApps, getMyApps, createApp } from '@/api/yingyongguanli'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'
import { Search, Send, Plus } from 'lucide-react'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'

function Section({ title, children, description }: { title: string; description?: string; children: React.ReactNode }) {
    return (
        <div className="space-y-3">
            <div>
                <h2 className="text-xl font-semibold">{title}</h2>
                {description && <p className="text-sm text-muted-foreground">{description}</p>}
            </div>
            {children}
        </div>
    )
}

export default function AppPage() {
    const navigate = useNavigate()
    const [myApps, setMyApps] = useState<API.AppVO[]>([])
    const [featuredApps, setFeaturedApps] = useState<API.AppVO[]>([])
    const [myAppsLoading, setMyAppsLoading] = useState(true)
    const [featuredAppsLoading, setFeaturedAppsLoading] = useState(true)
    const [creating, setCreating] = useState(false)
    
    // 分页状态
    const [myAppsPage, setMyAppsPage] = useState(1)
    const [myAppsTotal, setMyAppsTotal] = useState(0)
    const [featuredAppsPage, setFeaturedAppsPage] = useState(1)
    const [featuredAppsTotal, setFeaturedAppsTotal] = useState(0)
    
    // 搜索状态
    const [myAppsSearch, setMyAppsSearch] = useState('')
    const [featuredAppsSearch, setFeaturedAppsSearch] = useState('')
    
    // 创建应用表单
    const [appName, setAppName] = useState('')
    const [initPrompt, setInitPrompt] = useState('')

    // 加载我的应用
    const loadMyApps = async (page = 1, search = '') => {
        setMyAppsLoading(true)
        try {
            const response = await getMyApps({ 
                pageNum: page, 
                pageSize: 20,
                appName: search || undefined
            })
            if (response.data.code === 0) {
                setMyApps(response.data.data?.records || [])
                setMyAppsTotal(response.data.data?.totalRow || 0)
            }
        } catch (error) {
            toast.error('加载我的应用失败')
        } finally {
            setMyAppsLoading(false)
        }
    }

    // 加载精选应用
    const loadFeaturedApps = async (page = 1, search = '') => {
        setFeaturedAppsLoading(true)
        try {
            const response = await getFeaturedApps({ 
                pageNum: page, 
                pageSize: 20,
                appName: search || undefined
            })
            if (response.data.code === 0) {
                setFeaturedApps(response.data.data?.records || [])
                setFeaturedAppsTotal(response.data.data?.totalRow || 0)
            }
        } catch (error) {
            toast.error('加载精选应用失败')
        } finally {
            setFeaturedAppsLoading(false)
        }
    }

    // 创建应用
    const handleCreateApp = async () => {
        if (!appName.trim() || !initPrompt.trim()) {
            toast.error('请填写应用名称和初始提示词')
            return
        }
        
        setCreating(true)
        try {
            const response = await createApp({
                appName: appName.trim(),
                initPrompt: initPrompt.trim()
            })
            
            if (response.data.code === 0) {
                toast.success('应用创建成功')
                const appId = response.data.data
                // 跳转到对话页
                navigate(`/chat/${appId}`)
            } else {
                toast.error(response.data.message || '创建失败')
            }
        } catch (error) {
            toast.error('创建应用失败')
        } finally {
            setCreating(false)
        }
    }

    useEffect(() => {
        loadMyApps(myAppsPage, myAppsSearch)
    }, [myAppsPage])

    useEffect(() => {
        loadFeaturedApps(featuredAppsPage, featuredAppsSearch)
    }, [featuredAppsPage])

    useEffect(() => {
        loadMyApps(1, myAppsSearch)
        loadFeaturedApps(1, featuredAppsSearch)
    }, [])

    return (
        <div className="container mx-auto max-w-7xl px-4 py-8 space-y-10">
            {/* 标题和描述 */}
            <div className="text-center space-y-4">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 via-green-500 to-yellow-500 bg-clip-text text-transparent">
                    一句话 · 星所想
                </h1>
                <p className="text-muted-foreground">与 AI 对话轻松创建应用和网站</p>
            </div>

            {/* 创建应用区域 */}
            <Card className="max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Plus className="w-5 h-5" />
                        创建新应用
                    </CardTitle>
                    <CardDescription>
                        使用 NoCode 创建一个高效的小工具，帮我计算......
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <label className="text-sm font-medium">应用名称</label>
                        <Input
                            placeholder="请输入应用名称"
                            value={appName}
                            onChange={(e) => setAppName(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium">初始提示词</label>
                        <Textarea
                            placeholder="描述你想要创建的应用功能..."
                            value={initPrompt}
                            onChange={(e) => setInitPrompt(e.target.value)}
                            rows={3}
                        />
                    </div>
                    <Button 
                        onClick={handleCreateApp} 
                        disabled={creating}
                        className="w-full"
                    >
                        <Send className="w-4 h-4 mr-2" />
                        {creating ? '创建中...' : '开始创建'}
                    </Button>
                </CardContent>
            </Card>

            {/* 我的应用 */}
            <Section title="我的作品" description="我创建的应用列表">
                <div className="flex items-center gap-2 mb-4">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                            placeholder="搜索我的应用..."
                            value={myAppsSearch}
                            onChange={(e) => setMyAppsSearch(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <Button 
                        variant="outline" 
                        onClick={() => loadMyApps(1, myAppsSearch)}
                    >
                        搜索
                    </Button>
                </div>
                
                {myAppsLoading ? (
                    <GridSkeleton />
                ) : (
                    <GridCards apps={myApps} emptyText="您还没有创建任何应用" />
                )}
                
                {myAppsTotal > 0 && (
                    <AppPagination 
                        current={myAppsPage}
                        total={Math.ceil(myAppsTotal / 20)}
                        onPageChange={setMyAppsPage}
                    />
                )}
            </Section>

            {/* 精选应用 */}
            <Section title="精选案例" description="公开的优质示例应用">
                <div className="flex items-center gap-2 mb-4">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                            placeholder="搜索精选应用..."
                            value={featuredAppsSearch}
                            onChange={(e) => setFeaturedAppsSearch(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <Button 
                        variant="outline" 
                        onClick={() => loadFeaturedApps(1, featuredAppsSearch)}
                    >
                        搜索
                    </Button>
                </div>
                
                {featuredAppsLoading ? (
                    <GridSkeleton />
                ) : (
                    <GridCards apps={featuredApps} emptyText="暂无精选应用" />
                )}
                
                {featuredAppsTotal > 0 && (
                    <AppPagination 
                        current={featuredAppsPage}
                        total={Math.ceil(featuredAppsTotal / 20)}
                        onPageChange={setFeaturedAppsPage}
                    />
                )}
            </Section>
        </div>
    )
}

function GridSkeleton() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
                <Card key={i}>
                    <CardHeader>
                        <Skeleton className="h-4 w-1/3" />
                        <Skeleton className="h-3 w-1/2" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-32 w-full" />
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}

function GridCards({ apps, emptyText }: { apps: API.AppVO[]; emptyText?: string }) {
    const navigate = useNavigate()
    
    if (!apps?.length) {
        return (
            <div className="rounded-lg border p-6 text-center text-muted-foreground">
                {emptyText || '暂无数据'}
            </div>
        )
    }
    
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {apps.map((app) => (
                <Card key={app.id} className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardHeader>
                        <CardTitle className="text-base truncate">{app.appName}</CardTitle>
                        <CardDescription>
                            创建于 {app.createTime ? new Date(app.createTime).toLocaleDateString() : '未知'}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <img
                            src={app.cover || '/logo2.png'}
                            alt={app.appName}
                            className="w-full h-32 object-cover rounded-md border"
                        />
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">
                                {app.codeGenType || 'html'}
                            </span>
                            <div className="flex gap-2">
                                <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => navigate(`/detail/${app.id}`)}
                                >
                                    查看
                                </Button>
                                <Button 
                                    size="sm"
                                    onClick={() => navigate(`/chat/${app.id}`)}
                                >
                                    对话
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}

function AppPagination({ current, total, onPageChange }: { 
    current: number; 
    total: number; 
    onPageChange: (page: number) => void 
}) {
    const pages = []
    const showPages = 5
    let start = Math.max(1, current - Math.floor(showPages / 2))
    let end = Math.min(total, start + showPages - 1)
    
    if (end - start + 1 < showPages) {
        start = Math.max(1, end - showPages + 1)
    }
    
    for (let i = start; i <= end; i++) {
        pages.push(i)
    }
    
    return (
        <Pagination className="mt-6">
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious 
                        onClick={() => current > 1 && onPageChange(current - 1)}
                        className={current <= 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                </PaginationItem>
                
                {pages.map((page) => (
                    <PaginationItem key={page}>
                        <PaginationLink
                            onClick={() => onPageChange(page)}
                            isActive={page === current}
                            className="cursor-pointer"
                        >
                            {page}
                        </PaginationLink>
                    </PaginationItem>
                ))}
                
                <PaginationItem>
                    <PaginationNext 
                        onClick={() => current < total && onPageChange(current + 1)}
                        className={current >= total ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    )
}