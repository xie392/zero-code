import { useUserStore } from '@/stores/user'
import { Navigate, useLocation } from 'react-router-dom'

const withAuth = (Component: React.ComponentType<any>) => {
    const AuthenticatedComponent = (props: any) => {
        const location = useLocation()
        const isLogined = useUserStore((state) => state.isLogined)
        const whiteList = ['/auth/sign-in', '/auth/sign-up']

        // 没有登录且当前路由不在白名单中，跳转到登录页面
        if (!isLogined && !whiteList.includes(location.pathname)) {
            return <Navigate to="/auth/sign-in" replace state={{ from: location.pathname }} />
        }

        // 已登录，但访问登录注册页面，跳转到主页
        if (isLogined && whiteList.includes(location.pathname)) {
            return <Navigate to="/" replace />
        }

        return <Component {...props} />
    }

    return AuthenticatedComponent
}

export default withAuth
