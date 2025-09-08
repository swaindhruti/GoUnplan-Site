import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import prisma from "@/lib/prisma";
import { comparePassword } from "@/utils/passwordUtils";
import { Role } from "@/types/auth";
import { verifyOtp } from "@/actions/phone/action";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
    // Email/Password Credentials
    Credentials({
      id: "credentials",
      name: "credentials",
      credentials: {
        email: {
          type: "email",
          label: "Email",
          placeholder: "johndoe@gmail.com"
        },
        password: {
          type: "password",
          label: "Password",
          placeholder: "********"
        }
      },
      async authorize(credentials) {
        try {
          if (!credentials) return null;
          const { email, password } = credentials;
          if (!email || !password) return null;

          const user = await prisma.user.findUnique({
            where: { email: email as string }
          });

          if (!user || !user.password) return null;

          const isValidPassword = await comparePassword(
            password as string,
            user.password
          );

          return isValidPassword ? user : null;
        } catch (error) {
          console.error("Error in credentials authorize:", error);
          return null;
        }
      }
    }),
    Credentials({
      id: "phone",
      name: "phone",
      credentials: {
        phone: {
          type: "text",
          label: "Phone",
          placeholder: "+1234567890"
        },
        otp: {
          type: "text",
          label: "OTP",
          placeholder: "123456"
        }
      },
      async authorize(credentials) {
        try {
          if (!credentials) return null;
          const { phone, otp } = credentials;
          if (!phone || !otp) return null;

          const otpResult = await verifyOtp(phone as string, otp as string);
          if (!otpResult.success) return null;

          let user = await prisma.user.findUnique({
            where: { phone: phone as string }
          });

          if (!user) {
            user = await prisma.user.create({
              data: {
                phone: phone as string,
                name: "",
                password: null,
                role: "USER" as Role
              }
            });
          }

          return user;
        } catch (error) {
          console.error("Error in phone authorize:", error);
          return null;
        }
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.phone = user.phone;
        token.name = user.name;

        if (account?.provider === "google") {
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email! }
          });
          if (existingUser) {
            token.role = existingUser.role;
            token.id = existingUser.id;
          } else {
            token.role = "USER" as Role;
          }
        } else {
          token.role = user.role;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.phone = token.phone as string;
        session.user.name = token.name as string;
        session.user.role = token.role as Role;
      }
      return session;
    },
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email! }
          });
          if (!existingUser) {
            const newUser = await prisma.user.create({
              data: {
                email: user.email!,
                name: user.name || "",
                image: user.image,
                password: null,
                role: "USER" as Role
              }
            });
            user.id = newUser.id;
          } else {
            user.id = existingUser.id;
          }
          return true;
        } catch (error) {
          console.error("Error handling Google user:", error);
          return false;
        }
      }
      return true;
    }
  },
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    error: "/auth/error"
  },
  secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
  trustHost: true,
  debug: process.env.NODE_ENV === "development"
});
