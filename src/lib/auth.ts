import { PrismaAdapter } from "@next-auth/prisma-adapter";
import bcrypt from "bcryptjs";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

if (!googleClientId || !googleClientSecret) {
  console.warn(
    "[auth] GOOGLE_CLIENT_ID/GOOGLE_CLIENT_SECRET não configurados — login com Google desabilitado até que sejam definidos no .env.",
  );
}

const credenciaisSchema = z.object({
  email: z.email(),
  senha: z.string().min(1),
});

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/entrar",
  },
  providers: [
    CredentialsProvider({
      name: "E-mail e senha",
      credentials: {
        email: { label: "E-mail", type: "email" },
        senha: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        const dados = credenciaisSchema.safeParse(credentials);
        if (!dados.success) return null;

        const user = await prisma.user.findUnique({
          where: { email: dados.data.email },
        });
        if (!user || !user.senhaHash || user.excluidoEm) return null;

        const senhaValida = await bcrypt.compare(
          dados.data.senha,
          user.senhaHash,
        );
        if (!senhaValida) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        };
      },
    }),
    ...(googleClientId && googleClientSecret
      ? [
          GoogleProvider({
            clientId: googleClientId,
            clientSecret: googleClientSecret,
          }),
        ]
      : []),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.userId = user.id;
      }
      if (token.userId) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.userId as string },
          select: { perfil: true },
        });
        token.perfil = dbUser?.perfil;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.userId as string;
        session.user.perfil = token.perfil as string | undefined;
      }
      return session;
    },
  },
};
