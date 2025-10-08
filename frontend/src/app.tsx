import { Suspense } from 'react'
import GlobalLoading from '@/components/ui/global-loading'
import withAuth from '@/components/common/with-auth'

import { useRoutes } from 'react-router-dom'
import routes from '~react-pages'
import { Toaster } from '@/components/ui/sonner'

function App() {
    const router = useRoutes(routes)
    return (
        <Suspense fallback={<GlobalLoading />}>
            {router}
            <Toaster position="top-center" visibleToasts={3} closeButton />
        </Suspense>
    )
}

export default withAuth(App)
