import { SiteAppHeader } from '@/components/layout/site-app-header'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <main>
      <SiteAppHeader />
      {children}
    </main>
  )
}
