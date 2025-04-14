import type { AppRouter } from "@/trpc/index";

import { createTRPCClient, httpBatchLink, loggerLink } from "@trpc/client";

const client = createTRPCClient<AppRouter>({
  links: [
    /**
     * The function passed to enabled is an example in case you want to the link to
     * log to your console in development and only log errors in production
     */
    loggerLink({
      enabled: () => process.env.NODE_ENV === "development",
    }),
    httpBatchLink({
      url: `http://localhost:3000/api/trpc`,
    }),
  ],
});

export default client;
