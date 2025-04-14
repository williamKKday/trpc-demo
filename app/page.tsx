"use client";
import client from "@/trpc/client";
import { useEffect, useState } from "react";
import Button from "@/components/button";

export default function Home() {
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    // batch requests
    const fetchGreetings = async () => {
      Promise.all([
        client.greeting.query.query(),
        client.greeting.mutate.mutate(),
        client.greeting.sayHello.query("Rezio"),
        client.greeting.sayHelloToUser.mutate({ name: "Rezio", age: 5 }),
      ]).then(([query, mutate, sayHello, sayHelloToUser]) => {
        console.log(query, mutate, sayHello, sayHelloToUser);
      });
    };

    fetchGreetings();
  }, []);

  return (
    <div className="p-4">
      <div className="flex gap-4">
        <Button
          onClick={async () => {
            const result = await client.greeting.query.query();
            setGreeting(result);
          }}
        >
          Simple Query
        </Button>
        <Button
          onClick={async () => {
            const result = await client.greeting.mutate.mutate();
            setGreeting(result);
          }}
        >
          Simple Mutate
        </Button>
        <Button
          onClick={async () => {
            const result = await client.greeting.sayHello.query("Rezio");
            setGreeting(result);
          }}
        >
          Query with Input
        </Button>
        <Button
          onClick={async () => {
            const result = await client.greeting.sayHelloToUser.mutate({
              name: "Rezio",
              age: 5,
            });
            setGreeting(result);
          }}
        >
          Mutate with Input
        </Button>
      </div>

      <div className="mt-4 p-2 border rounded-md flex gap-2">
        <div>greeting：</div>
        <div>{greeting}</div>
      </div>
    </div>
  );
}
