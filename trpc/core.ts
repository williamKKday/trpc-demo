import type { Context } from "@/trpc/context";

import { initTRPC, TRPCError } from "@trpc/server";

// You can use any variable name you like.
const t = initTRPC.context<Context>().create({
  sse: {
    ping: {
      enabled: true,
      intervalMs: 1_000,
    },
    client: {
      reconnectAfterInactivityMs: 20_000,
    },
  },
});

export const router = t.router;
export const publicProcedure = t.procedure;

// middleware to check if user is authenticated
export const protectedProcedure = publicProcedure.use(async ({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  // We overwrite the context with `session`, which will also overwrite the types used in your procedure.
  return next({ ctx: { session: ctx.session } });
});

// middleware to check if user is admin
export const secretProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (!ctx.session.isAdmin) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "You are not authorized to access this resource",
    });
  }
  return next({ ctx });
});
