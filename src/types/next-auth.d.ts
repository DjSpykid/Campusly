import type { DefaultSession } from "next-auth";
import type { Role } from "@/config/roles";

declare module "next-auth" {
  interface Session {
    user: { id: string; roles: Role[] } & DefaultSession["user"];
  }
  interface User {
    roles?: Role[];
  }
}
