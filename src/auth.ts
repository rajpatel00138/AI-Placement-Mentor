import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createUserFallback, findUserByEmailFallback } from "@/lib/auth-store";

const authSecret = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET ?? "dev-secret-change-me";

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: authSecret,
  trustHost: true,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/login",
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = String(credentials.email).toLowerCase().trim();
        const password = String(credentials.password);

        const shouldUsePrisma = process.env.USE_PRISMA_PERSISTENCE === "true" || process.env.NODE_ENV === "production";

        if (shouldUsePrisma) {
          try {
            const user = await prisma.user.findUnique({
              where: { email },
            });

            if (user) {
              const isValidPassword = await bcrypt.compare(password, user.password);
              if (!isValidPassword) {
                return null;
              }

              return {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
              };
            }
          } catch (error) {
            console.warn("Prisma auth lookup failed, falling back to in-memory auth", error);
          }
        }

        const fallbackUser = await findUserByEmailFallback(email);

        if (!fallbackUser) {
          return null;
        }

        const isValidPassword = await bcrypt.compare(password, fallbackUser.password);

        if (!isValidPassword) {
          return null;
        }

        return {
          id: fallbackUser.id,
          name: fallbackUser.name,
          email: fallbackUser.email,
          role: fallbackUser.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const authUser = user as typeof user & {
          id?: string;
          role?: string;
          name?: string | null;
        };

        token.id = authUser.id as string;
        token.role = authUser.role as string;
        token.name = authUser.name as string;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        const sessionUser = session.user as typeof session.user & {
          id?: string;
          role?: string;
          name?: string | null;
        };

        sessionUser.id = token.id as string;
        sessionUser.role = token.role as string;
        sessionUser.name = token.name as string;
      }

      return session;
    },
  },
});
