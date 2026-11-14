import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],
  callbacks: {
    async session({ session, token }: { session: any; token: any }) {
      session.user.id = token.sub;
      return session;
    },
    async signIn({ user, account, profile }: { user: any; account: any; profile?: any }) {
      try {
        if (!profile?.email) return false;

        // Verificar se o usuário já existe no banco de dados
        let dbUser = await prisma.user.findUnique({
          where: { email: profile.email },
        });

        // Se o usuário não existir, criar um novo
        if (!dbUser) {
          dbUser = await prisma.user.create({
            data: {
              name: profile.name,
              email: profile.email,
              role: "CLIENT",
              planTier: "FREE",
              avatarUrl: profile.picture,
            },
          });
        }
        return true;
      } catch (error) {
        console.error("Erro ao autenticar usuário do Google:", error);
        return false;
      }
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };