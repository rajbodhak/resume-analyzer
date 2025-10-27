import NextAuth, { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Invalid credentials");
                }

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email }
                });

                if (!user || !user.password) {
                    throw new Error("Invalid credentials");
                }

                const isPasswordValid = await bcrypt.compare(
                    credentials.password,
                    user.password
                );

                if (!isPasswordValid) {
                    throw new Error("Invalid credentials");
                }

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name ?? undefined,
                    subscriptionTier: user.subscriptionTier,
                    creditsRemaining: user.creditsRemaining,
                    analysesCount: user.analysesCount,
                };
            }
        }),
    ],

    session: {
        strategy: "jwt",
    },

    callbacks: {
        async jwt({ token, user, trigger, session }) {
            if (user) {
                token.id = user.id;
                token.subscriptionTier = user.subscriptionTier;
                token.creditsRemaining = user.creditsRemaining;
                token.analysesCount = user.analysesCount;
            }

            // Allow manual token updates
            if (trigger === "update" && session) {
                token.creditsRemaining = session.creditsRemaining;
                token.analysesCount = session.analysesCount;
            }

            return token;
        },

        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.subscriptionTier = token.subscriptionTier as string;
                session.user.creditsRemaining = token.creditsRemaining as number;
                session.user.analysesCount = token.analysesCount as number;
            }
            return session;
        }
    },

    pages: {
        signIn: '/auth/signin',
    },

    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };