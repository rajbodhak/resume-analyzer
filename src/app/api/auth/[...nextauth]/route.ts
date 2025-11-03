import NextAuth, { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],

    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },

    callbacks: {
        async jwt({ token, user, trigger, session }) {
            // On first sign in
            if (user) {
                token.id = user.id;

                try {
                    const dbUser = await prisma.user.findUnique({
                        where: { id: user.id },
                        select: {
                            subscriptionTier: true,
                            creditsRemaining: true,
                            analysesCount: true,
                        }
                    });

                    // Handle case where user exists but hasn't been updated yet
                    token.subscriptionTier = dbUser?.subscriptionTier ?? "free";
                    token.creditsRemaining = dbUser?.creditsRemaining ?? 50;
                    token.analysesCount = dbUser?.analysesCount ?? 0;
                } catch (error) {
                    console.error("Error fetching user from database:", error);
                    // Fallback to defaults
                    token.subscriptionTier = "free";
                    token.creditsRemaining = 50;
                    token.analysesCount = 0;
                }
            }

            // Allow manual token updates
            if (trigger === "update" && session) {
                token.creditsRemaining = session.creditsRemaining ?? token.creditsRemaining;
                token.analysesCount = session.analysesCount ?? token.analysesCount;
            }

            return token;
        },

        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id;
                session.user.subscriptionTier = token.subscriptionTier;
                session.user.creditsRemaining = token.creditsRemaining;
                session.user.analysesCount = token.analysesCount;
            }
            return session;
        },

        async redirect({ url, baseUrl }) {
            // Allows relative callback URLs
            if (url.startsWith("/")) return `${baseUrl}${url}`;
            // Allows callback URLs on the same origin
            else if (new URL(url).origin === baseUrl) return url;
            // Default redirect to dashboard after sign in
            return `${baseUrl}/dashboard`;
        },

        //  OPTIONAL: Add signIn callback to ensure user can sign in
        async signIn({ user, account, profile }) {
            return true; // Allow sign in
        },
    },

    events: {
        // This runs AFTER user is created
        async createUser({ user }) {
            try {
                // Set default values for new users
                await prisma.user.update({
                    where: { id: user.id },
                    data: {
                        creditsRemaining: 50,
                        subscriptionTier: "free",
                        analysesCount: 0,
                    }
                });
                console.log("✅ New user initialized with defaults:", user.id);
            } catch (error) {
                console.error("Error initializing user defaults:", error);
            }
        },

        // Log when user signs in
        async signIn({ user }) {
            console.log("✅ User signed in:", user.email);
        },
    },

    pages: {
        signIn: '/auth/signin',
        error: '/auth/signin',
    },

    secret: process.env.NEXTAUTH_SECRET,

    //  debug in development
    debug: process.env.NODE_ENV === 'development',
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };