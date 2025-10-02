import { DefaultSession, DefaultUser } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

export type Role = "USER" | "HOST" | "ADMIN" | "SUPPORT";

declare module "next-auth" {
  interface Session {
    user: {
      role: Role;
      id: string;
      phone?: string;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    role: Role;
    phone?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    role: Role;
  }
}
