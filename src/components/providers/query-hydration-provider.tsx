import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from '@tanstack/react-query'

export default async function QueryHydrationProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // this sets the cache time to 5 minutes
      },
    },
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  )
}
