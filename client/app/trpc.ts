import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "../../server/src/routes/app";

export const trpc = createTRPCReact<AppRouter>();
