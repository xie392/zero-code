import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useUserStore } from '@/stores/user'

export default function UserProfilePage() {
    const user = useUserStore((s) => s.user)
    const logout = useUserStore((s) => s.logout)

    return (
        <div className="container mx-auto max-w-4xl px-4 py-8">
            <Card className="mb-6">
                <CardHeader className="flex items-center gap-4">
                    <Avatar className="h-14 w-14">
                        <AvatarImage src={user?.userAvatar} />
                        <AvatarFallback>{user?.userName?.[0] ?? 'U'}</AvatarFallback>
                    </Avatar>
                    <div>
                        <CardTitle className="text-xl">{user?.userName || '未命名用户'}</CardTitle>
                        <CardDescription>{user?.userProfile || '这位用户很神秘，还没有简介。'}</CardDescription>
                    </div>
                    <div className="ml-auto">
                        <Button variant="outline" onClick={() => logout()}>退出登录</Button>
                    </div>
                </CardHeader>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>账户信息</CardTitle>
                    <CardDescription>查看当前登录用户的基础资料</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InfoItem label="用户账号" value={user?.userAccount || '-'} />
                        <InfoItem label="用户角色" value={user?.userRole || '-'} />
                        <InfoItem label="用户ID" value={String(user?.id ?? '-') } />
                        <InfoItem label="创建时间" value={user?.createTime || '-'} />
                    </div>
                    <Separator />
                    <p className="text-sm text-muted-foreground">提示：若资料不准确，请联系管理员更新。</p>
                </CardContent>
            </Card>
        </div>
    )
}

function InfoItem({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-lg border p-4">
            <div className="text-xs text-muted-foreground mb-1">{label}</div>
            <div className="text-sm font-medium">{value}</div>
        </div>
    )
}