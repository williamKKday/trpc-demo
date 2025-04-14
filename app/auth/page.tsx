"use client";

import client from "@/trpc/client";
import Button from "@/components/button";

import { useCallback, useEffect, useState } from "react";

export default function ProtectedPage() {
  const [isLogin, setIsLogin] = useState(false);

  const [result, setResult] = useState("");

  const login = useCallback(async (id: string) => {
    try {
      const result = await client.user.login.mutate({ id });
      setIsLogin(!!result);
      window.localStorage.setItem("token", result.uuid);
    } catch (error) {
      console.error("login failed", error);
      window.localStorage.removeItem("token");
    }
  }, []);

  const logout = useCallback(async () => {
    await client.user.logout.mutate();
    window.localStorage.removeItem("token");
    setIsLogin(false);
    setResult("");
  }, []);

  useEffect(() => {
    const init = async () => {
      try {
        const token = window.localStorage.getItem("token");
        if (token) {
          await login(token);
        }
      } catch (error) {
        console.error("init failed", error);
        setIsLogin(false);
      }
    };

    init();
  }, [login]);

  if (!isLogin) {
    return (
      <div className="p-4">
        <div className="flex gap-4">
          <Button onClick={() => login("1")}>Admin Login</Button>
          <Button onClick={() => login("2")}>User Login</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex justify-end">
        <Button onClick={logout}>Log out</Button>
      </div>

      <div className="mt-6 flex gap-4">
        <Button
          onClick={async () => {
            const result = await client.user.profile.query();
            setResult(JSON.stringify(result));
          }}
        >
          Get Profile
        </Button>
        <Button
          onClick={async () => {
            const result = await client.user.getUserList.query();
            setResult(JSON.stringify(result));
          }}
        >
          Get User List
        </Button>
      </div>
      <div className="mt-4 p-2 border rounded-md flex gap-2">
        <div>Result：</div>
        <div>{result}</div>
      </div>
    </div>
  );
}
