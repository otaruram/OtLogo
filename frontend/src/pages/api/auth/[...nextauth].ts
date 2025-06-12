import NextAuth, { AuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/prisma";
import { JWT } from "next-auth/jwt";

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    
    }),
    {
      id: "gumroad",
      name: "Gumroad",
      type: "oauth",
      version: "2.0",
      authorization: {
        url: "https://gumroad.com/oauth/authorize",
        params: { scope: "view_profile view_sales" },
      },
      token: "https://api.gumroad.com/oauth/token",
      userinfo: {
        url: "https://api.gumroad.com/v2/user",
        async request(context) {
          if (!context.tokens.access_token) {
            throw new Error("Access token not found");
          }
          const response = await fetch("https://api.gumroad.com/v2/user", {
            headers: {
              Authorization: `Bearer ${context.tokens.access_token}`,
            },
          });
          const data = await response.json();
          if (!data.success) {
            throw new Error(data.message || "Failed to fetch user data from Gumroad");
          }
          return data.user;
        },
      },
      async profile(profile: any) {
        return {
          id: profile.user_id,
          name: profile.name,
          email: profile.email,
          image: null,
        } as any;
      },
      clientId: process.env.GUMROAD_CLIENT_ID as string,
      clientSecret: process.env.GUMROAD_CLIENT_SECRET as string,
    },
  ],
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
        if (dbUser) {
          token.id = dbUser.id;
          token.name = dbUser.name;
          token.email = dbUser.email;
          token.image = dbUser.image;
          token.credits = dbUser.credits;
          token.createdAt = dbUser.createdAt;
        }
      }

      if (trigger === "update" && session) {
        return { ...token, ...session.user };
      }

      return token;
    },
    async session({ session, token }: { session: any; token: JWT }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string | null | undefined;
        session.user.email = token.email as string | null | undefined;
        session.user.image = token.image as string | null | undefined;
        session.user.credits = token.credits as number | null | undefined;
        session.user.createdAt = token.createdAt as Date | null | undefined;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};

export default NextAuth(authOptions);