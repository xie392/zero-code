import { UserTable } from '@/components/admin/user-table'

export default function AdminPage() {
    return (
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <UserTable />
        </div>
    )
}
