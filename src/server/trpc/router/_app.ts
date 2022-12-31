import { router } from "../trpc";
import { authRouter } from "./auth";
import { mlRouter } from "./ml";

export const appRouter = router({
  ml: mlRouter,
  auth: authRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
