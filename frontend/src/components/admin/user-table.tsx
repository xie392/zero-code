import * as React from 'react'
import { IconEdit, IconTrash } from '@tabler/icons-react'
import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFilteredRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
    VisibilityState
} from '@tanstack/react-table'
import { toast } from 'sonner'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

import { listUserVoByPage, deleteUser } from '@/api/yonghuguanli'
import { UserEditDialog } from './user-edit-dialog'
import { cn } from '@/lib/utils'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from '@/components/ui/alert-dialog'

// 用户角色映射
const roleMap = {
    admin: { label: '管理员', variant: 'destructive' as const },
    user: { label: '普通用户', variant: 'secondary' as const }
}

interface UserTableProps {
    className?: string
}

export function UserTable({ className }: UserTableProps) {
    const [data, setData] = React.useState<API.UserVO[]>([])
    const [loading, setLoading] = React.useState(true)
    const [rowSelection, setRowSelection] = React.useState({})
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [pagination, setPagination] = React.useState({
        pageIndex: 0,
        pageSize: 10
    })
    const [totalPages, setTotalPages] = React.useState(0)

    // 编辑对话框状态
    const [editDialogOpen, setEditDialogOpen] = React.useState(false)
    const [editingUser, setEditingUser] = React.useState<API.UserVO | null>(null)

    // 删除确认对话框状态
    const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)
    const [deletingUser, setDeletingUser] = React.useState<API.UserVO | null>(null)
    const [deleteLoading, setDeleteLoading] = React.useState(false)

    // 处理编辑用户
    const handleEditUser = (user: API.UserVO) => {
        setEditingUser(user)
        setEditDialogOpen(true)
    }

    // 处理删除用户
    const handleDeleteUser = (user: API.UserVO) => {
        setDeletingUser(user)
        setDeleteDialogOpen(true)
    }

    // 确认删除用户
    const confirmDeleteUser = async () => {
        if (!deletingUser?.id) return

        setDeleteLoading(true)
        try {
            await deleteUser({ id: deletingUser.id })
            toast.success('用户删除成功')
            fetchUsers() // 重新获取数据
            setDeleteDialogOpen(false)
            setDeletingUser(null)
        } catch (error) {
            toast.error('删除用户失败')
        } finally {
            setDeleteLoading(false)
        }
    }

    // 处理编辑成功
    const handleEditSuccess = () => {
        fetchUsers() // 重新获取数据
    }

    // 定义列配置
    const columns: ColumnDef<API.UserVO>[] = React.useMemo(
        () => [
            {
                id: 'select',
                header: ({ table }) => (
                    <div className="flex items-center justify-center">
                        <Checkbox
                            checked={
                                table.getIsAllPageRowsSelected() ||
                                (table.getIsSomePageRowsSelected() && 'indeterminate')
                            }
                            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                            aria-label="Select all"
                        />
                    </div>
                ),
                cell: ({ row }) => (
                    <div className="flex items-center justify-center">
                        <Checkbox
                            checked={row.getIsSelected()}
                            onCheckedChange={(value) => row.toggleSelected(!!value)}
                            aria-label="Select row"
                        />
                    </div>
                ),
                enableSorting: false,
                enableHiding: false
            },
            {
                accessorKey: 'id',
                header: 'ID',
                cell: ({ row }) => <div className="font-mono text-sm">{row.getValue('id')}</div>
            },
            {
                accessorKey: 'userAvatar',
                header: '头像',
                cell: ({ row }) => {
                    const avatar = row.getValue('userAvatar') as string
                    const userName = row.getValue('userName') as string
                    return (
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={avatar} alt={userName} />
                            <AvatarFallback>{userName?.charAt(0)?.toUpperCase()}</AvatarFallback>
                        </Avatar>
                    )
                },
                enableSorting: false
            },
            {
                accessorKey: 'userName',
                header: '用户名',
                cell: ({ row }) => <div className="font-medium">{row.getValue('userName')}</div>
            },
            {
                accessorKey: 'userAccount',
                header: '账号',
                cell: ({ row }) => <div className="font-mono text-sm">{row.getValue('userAccount')}</div>
            },
            {
                accessorKey: 'userRole',
                header: '角色',
                cell: ({ row }) => {
                    const role = row.getValue('userRole') as keyof typeof roleMap
                    const roleInfo = roleMap[role] || { label: role, variant: 'secondary' as const }
                    return <Badge variant={roleInfo.variant}>{roleInfo.label}</Badge>
                },
                filterFn: (row, id, value) => {
                    return value.includes(row.getValue(id))
                }
            },
            {
                accessorKey: 'userProfile',
                header: '简介',
                cell: ({ row }) => {
                    const profile = row.getValue('userProfile') as string
                    return <div className="max-w-[200px] truncate">{profile || '暂无简介'}</div>
                }
            },
            {
                accessorKey: 'createTime',
                header: '创建时间',
                cell: ({ row }) => {
                    const date = row.getValue('createTime') as string
                    return (
                        <div className="text-sm text-muted-foreground">
                            {date ? new Date(date).toLocaleString() : '-'}
                        </div>
                    )
                }
            },
            {
                id: 'actions',
                header: '操作',
                cell: ({ row }) => {
                    const user = row.original

                    return (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                    <span className="sr-only">打开菜单</span>
                                    <IconEdit className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleEditUser(user)}>
                                    <IconEdit className="mr-2 h-4 w-4" />
                                    编辑用户
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onClick={() => handleDeleteUser(user)}
                                    className="text-red-600"
                                >
                                    <IconTrash className="mr-2 h-4 w-4" />
                                    删除用户
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )
                }
            }
        ],
        []
    )

    // 获取用户数据
    const fetchUsers = React.useCallback(async () => {
        try {
            setLoading(true)
            const response = await listUserVoByPage({
                pageNum: pagination.pageIndex + 1,
                pageSize: pagination.pageSize
            })

            if (response.data.code === 0) {
                setData(response.data?.data?.records || [])
                setTotalPages(response.data?.data?.totalPage || 0)
            } else {
                toast.error('获取用户数据失败')
            }
        } catch (error) {
            toast.error('获取用户数据失败')
            console.error('Failed to fetch users:', error)
        } finally {
            setLoading(false)
        }
    }, [pagination.pageIndex, pagination.pageSize])

    // 初始化数据
    React.useEffect(() => {
        fetchUsers()
    }, [fetchUsers])

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
            columnVisibility,
            rowSelection,
            columnFilters,
            pagination
        },
        pageCount: totalPages, // 使用服务器返回的总页数
        manualPagination: true, // 启用手动分页
        enableRowSelection: true,
        onRowSelectionChange: setRowSelection,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues()
    })

    return (
        <div className={cn('p-5', className)}>
            {/* 搜索和筛选 */}
            <div className="flex items-center pb-4">
                <Input
                    placeholder="搜索用户名..."
                    value={(table.getColumn('userName')?.getFilterValue() as string) ?? ''}
                    onChange={(event) => table.getColumn('userName')?.setFilterValue(event.target.value)}
                    className="max-w-sm"
                />
                <div className="ml-auto">
                    <Button onClick={fetchUsers} disabled={loading} variant="outline">
                        刷新数据
                    </Button>
                </div>
            </div>

            {/* 表格 */}
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(header.column.columnDef.header, header.getContext())}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    加载中...
                                </TableCell>
                            </TableRow>
                        ) : table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    暂无数据
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* 分页 */}
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium">每页显示</p>
                        <Select
                            value={`${table.getState().pagination.pageSize}`}
                            onValueChange={(value) => {
                                table.setPageSize(Number(value))
                            }}
                        >
                            <SelectTrigger className="h-8 w-[70px]">
                                <SelectValue placeholder={table.getState().pagination.pageSize} />
                            </SelectTrigger>
                            <SelectContent side="top">
                                {[10, 20, 30, 40, 50].map((pageSize) => (
                                    <SelectItem key={pageSize} value={`${pageSize}`}>
                                        {pageSize}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex items-center justify-center text-sm font-medium">
                        第 {table.getState().pagination.pageIndex + 1} 页，共 {totalPages} 页
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                        >
                            上一页
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                        >
                            下一页
                        </Button>
                    </div>
                </div>
            </div>

            {/* 编辑用户对话框 */}
            <UserEditDialog
                open={editDialogOpen}
                onOpenChange={setEditDialogOpen}
                user={editingUser}
                onSuccess={handleEditSuccess}
            />

            {/* 删除确认对话框 */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>确认删除用户</AlertDialogTitle>
                        <AlertDialogDescription>
                            您确定要删除用户 "{deletingUser?.userName}" 吗？此操作无法撤销。
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>取消</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDeleteUser}
                            disabled={deleteLoading}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            {deleteLoading ? '删除中...' : '删除'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
