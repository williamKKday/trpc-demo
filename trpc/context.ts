import { USER_LIST } from "@/db";
import { type FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";

async function getSession({ req }: FetchCreateContextFnOptions) {
  const auth = req.headers.get("Authorization");
  const [, token = ""] = auth?.split(" ") ?? [];

  // validate token and retrieve user from database
  const user = USER_LIST.find((user) => user.uuid === token);

  if (!user) {
    return { user: null, isAdmin: false };
  }
  return { user, isAdmin: user.uuid === "1" };
}

// context holds data that all of your tRPC procedures will have access to
export const createContext = async ({
  req,
  resHeaders,
  info,
}: FetchCreateContextFnOptions) => {
  const session = await getSession({ req, resHeaders, info });

  return {
    req,
    session,
  };
};

export type Context = Awaited<ReturnType<typeof createContext>>;
