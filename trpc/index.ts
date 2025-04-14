import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

import { router } from "./core";
import { greetingRouter } from "./routes/greeting";

const appRouter = router({
  greeting: greetingRouter,
});

export type RouterInput = inferRouterInputs<AppRouter>;
export type RouterOutput = inferRouterOutputs<AppRouter>;
export type AppRouter = typeof appRouter;
export default appRouter;
