import ApiClient from "@/api-client/";
import { dehydrate } from "@tanstack/query-core";
import { HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { Metadata } from "next";
import GlobalConfigList from "./_components/global-config-list";

const questionsClient = new ApiClient();

export const metadata: Metadata = {
  title: "BTS | SSO configs",
  description: "View all configs",
};

export default async function EventsPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["configs"],
    queryFn: () => questionsClient.getConfigs(),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <GlobalConfigList />
    </HydrationBoundary>
  );
}
