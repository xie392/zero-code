import { SiteAppHeader } from '@/components/layout/site-app-header'

export default function RootLayout({ children }: LayoutRootProps) {
  return (
    <main>
      <SiteAppHeader />
      {children}
    </main>
  )
}
