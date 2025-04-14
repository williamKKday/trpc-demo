import type { Context } from "@/trpc/context";

import { initTRPC } from "@trpc/server";

// You can use any variable name you like.
const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;
