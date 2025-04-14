import { USER_LIST } from "@/db";
import {
  protectedProcedure,
  publicProcedure,
  router,
  secretProcedure,
} from "@/trpc/core";

import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const userRouter = router({
  login: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) => {
      const user = USER_LIST.find((user) => user.uuid === input.id);
      if (!user) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid User",
        });
      }
      return user;
    }),
  logout: publicProcedure.mutation(() => {
    return true;
  }),

  profile: protectedProcedure.query(({ ctx }) => {
    const { user } = ctx.session;
    return {
      ...user,
    };
  }),

  getUserList: secretProcedure.query(() => {
    return USER_LIST;
  }),
});
