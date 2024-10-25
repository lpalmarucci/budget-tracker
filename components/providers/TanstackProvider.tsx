"use client";

import * as React from "react";
import { type PropsWithChildren } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export function TanstackProvider({ children }: PropsWithChildren) {
  const [queryClient] = React.useState(new QueryClient());
  console.log(queryClient);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
