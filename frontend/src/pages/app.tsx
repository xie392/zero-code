import { BaseLayout } from "@/components/layout";
import { Outlet } from 'react-router-dom'

export default function AppPage() {
    return (
        <BaseLayout>
            <Outlet />
        </BaseLayout>
    )
}