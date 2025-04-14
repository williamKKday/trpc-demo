import { z } from "zod";

import { publicProcedure, router } from "@/trpc/core";

export const greetingRouter = router({
  // simple query
  query: publicProcedure.query(() => {
    return "query";
  }),
  // simple mutation
  mutate: publicProcedure.mutation(() => {
    return "mutated";
  }),

  // query with input and output
  sayHello: publicProcedure
    .input(z.string())
    .output(z.string())
    .query(({ input }) => {
      return `Hello, ${input}!`;
    }),

  sayHelloToUser: publicProcedure
    .input(
      z.object({
        name: z.string(),
        age: z.number(),
      })
    )
    .mutation(({ input }) => {
      return `Hello, ${input.name}! You are ${input.age} years old.`;
    }),
});
