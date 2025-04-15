import type { AppRouter } from "@/trpc/index";

import {
  createTRPCClient,
  httpBatchLink,
  httpSubscriptionLink,
  loggerLink,
  splitLink,
} from "@trpc/client";

async function getToken() {
  if (typeof window === "undefined") {
    return undefined;
  }
  const token = window.localStorage.getItem("token");
  return token ? `Bearer ${token}` : undefined;
}

const client = createTRPCClient<AppRouter>({
  links: [
    /**
     * The function passed to enabled is an example in case you want to the link to
     * log to your console in development and only log errors in production
     */
    loggerLink({
      enabled: () => process.env.NODE_ENV === "development",
    }),
    splitLink({
      condition: (op) => op.type === "subscription",
      true: httpSubscriptionLink({
        url: `/api/trpc`,
      }),
      false: httpBatchLink({
        url: `/api/trpc`,
        // You can pass any HTTP headers you wish here
        headers: async () => {
          return {
            Authorization: await getToken(),
          };
        },
      }),
    }),
  ],
});

export default client;
