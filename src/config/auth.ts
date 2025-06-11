import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { comparePassword } from "@/utils/passwordUtils";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      credentials: {
        email: {
          type: "email",
          label: "Email",
          placeholder: "johndoe@gmail.com",
        },
        password: {
          type: "password",
          label: "Password",
          placeholder: "********",
        },
      },
      async authorize(credentials) {
        try {
          if (!credentials) {
            return null;
          }

          const { email, password } = credentials;
          if (!email || !password) {
            return null; // Return null instead of throwing error for missing credentials
          }

          const user = await prisma.user.findUnique({
            where: { email: email as string },
          });

          if (!user) {
            return null; // Return null instead of throwing error for user not found
          }

          const isValidPassword = await comparePassword(
            password as string,
            user.password
          );

          return isValidPassword ? user : null;
        } catch (error) {
          console.error("Error in authorize:", error);
          return null; // Return null instead of throwing for unexpected errors
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    error: "/auth/error",
  },
  secret: process.env.AUTH_SECRET,
});
