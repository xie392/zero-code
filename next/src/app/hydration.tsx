import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from "@tanstack/react-query";
// import getData from "@/api/getData";

export default async function Hydration({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // this sets the cache time to 5 minutes
      },
    },
  });
  //   await Promise.all([
  //     queryClient.prefetchQuery({
  //       queryKey: ["profiles", "user"],
  //       queryFn: () => getData("profiles"),
  //     }),
  //     queryClient.prefetchQuery({
  //       queryKey: ["permissions", "user"],
  //       queryFn: () => getData("permissions"),
  //     }),
  //   ]);
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  );
}
