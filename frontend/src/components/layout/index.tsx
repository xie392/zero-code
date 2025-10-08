import { Header } from './modules/header'

export function BaseLayout({ children }: { children?: React.ReactNode }) {
    return (
        <>
            <Header />
            {children}
        </>
    )
}
