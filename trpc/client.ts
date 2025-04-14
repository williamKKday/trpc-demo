import type { AppRouter } from "@/trpc/index";

import { createTRPCClient, httpBatchLink } from "@trpc/client";

const client = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: `http://localhost:3000/api/trpc`,
    }),
  ],
});

export default client;
