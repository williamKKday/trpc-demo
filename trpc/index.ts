import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

import { router } from "./core";
import { greetingRouter } from "./routes/greeting";
import { userRouter } from "./routes/user";
import { chatRouter, type Message } from "./routes/chat";

const appRouter = router({
  greeting: greetingRouter,
  user: userRouter,
  chat: chatRouter,
});

export type RouterInput = inferRouterInputs<AppRouter>;
export type RouterOutput = inferRouterOutputs<AppRouter>;
export type AppRouter = typeof appRouter;
export type ChatMessage = Message;

export default appRouter;
