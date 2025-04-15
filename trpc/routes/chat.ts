import { publicProcedure, router } from "@/trpc/core";

import { tracked } from "@trpc/server";
import EventEmitter, { on } from "events";
import { z } from "zod";

const eventEmitter = new EventEmitter();
const MessageAddEvent = "add";

const storedMessages: Message[] = [];

export type Message = {
  id: string;
  content: string;
  createdAt: string;
};

export const chatRouter = router({
  getMessages: publicProcedure.query(() =>
    storedMessages.sort(
      (message1, message2) =>
        new Date(message2.createdAt).getTime() -
        new Date(message1.createdAt).getTime()
    )
  ),

  sendMessage: publicProcedure
    .input(z.object({ content: z.string() }))
    .mutation(({ input }) => {
      const newMessage = {
        id: crypto.randomUUID(),
        content: input.content,
        createdAt: new Date().toISOString(),
      };
      eventEmitter.emit(MessageAddEvent, newMessage);
      storedMessages.push(newMessage);
    }),

  onMessage: publicProcedure
    .input(
      z.object({
        roomId: z.string(),
      })
    )
    .subscription(async function* (opts) {
      // listen for new events
      for await (const [data] of on(eventEmitter, MessageAddEvent, {
        // Passing the AbortSignal from the request automatically cancels the event emitter when the request is aborted
        signal: opts.signal,
      })) {
        const message = data as Message;
        // tracking the message id ensures the client can reconnect at any time and get the latest events this id
        yield tracked(message.id, message);
      }
    }),
});
