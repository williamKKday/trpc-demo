"use client";
import Button from "@/components/button";
import type { ChatMessage } from "@/trpc";
import client from "@/trpc/client";

import { useCallback, useEffect, useState } from "react";

const roomId = "room-id";
export default function ChatPage() {
  const [inputText, setInputText] = useState("");

  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const fetchMessages = useCallback(async () => {
    const messages = await client.chat.getMessages.query();
    setMessages((prevMessages) => {
      const filteredMessages = messages.filter(
        (message) => !prevMessages.some((prev) => prev.id === message.id)
      );
      return [...filteredMessages, ...prevMessages];
    });
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  useEffect(() => {
    const subscription = client.chat.onMessage.subscribe(
      { roomId },
      {
        signal: new AbortController().signal,
        onConnectionStateChange: async (event) => {
          console.log("Connection state is ", event.state);
          if (event.state === "connecting") {
            await fetchMessages();
          }
        },
        onError: (error) => {
          console.error("Error occurs!", error);
        },
        onData: (event) => {
          setMessages((prev) => [event.data, ...prev]);
        },
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchMessages]);

  const handleSendMessage = useCallback(async () => {
    await client.chat.sendMessage.mutate({ content: inputText });
    setInputText("");
  }, [inputText]);

  return (
    <div className="p-4">
      <div className="flex gap-2">
        <input
          className="border border-gray-300 bg-white rounded-md p-2 max-w-full min-w-[300px] text-gray-950"
          type="text"
          value={inputText}
          onChange={(event) => setInputText(event.target.value)}
        />
        <Button onClick={handleSendMessage}>send</Button>
      </div>

      <div className="my-4">Messages：</div>
      <div className="border border-gray-300 rounded-md p-4 bg-cyan-50 h-[500px] overflow-y-auto">
        <div className="flex flex-col">
          {messages.map((message, index) => (
            <div
              key={message.id}
              className="text-gray-950 border-b-1 last:border-b-0 border-gray-300 py-2 flex gap-1"
            >
              <span className="inline-block w-10">{index + 1}.</span>
              <span>{message.content}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
