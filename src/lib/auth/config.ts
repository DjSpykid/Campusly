import type { NextAuthConfig } from "next-auth";
import type { Role } from "@/config/roles";

export const authConfig = {
  pages: { signIn: "/login" },
  session: { strategy: "jwt" },
  providers: [],
  callbacks: {
    jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.roles = (user as { roles?: Role[] }).roles ?? ["customer"];
      }
      if (trigger === "update" && session?.roles) token.roles = session.roles as Role[];
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id as string;
      session.user.roles = (token.roles as Role[]) ?? ["customer"];
      return session;
    },
  },
} satisfies NextAuthConfig;
