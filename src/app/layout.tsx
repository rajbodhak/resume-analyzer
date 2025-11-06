import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavbarWrapper from "@/components/layout/NavbarWrapper";
import AuthProvider from "@/components/providers/auth-provider";
import { getSession } from "@/lib/auth";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Resume Analyzer",
  description: "Analyze your resume with AI-powered insights",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();

  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#0a0a0a] text-white`}
      >
        <AuthProvider session={session}>
          {/* Navbar with initial session */}
          <NavbarWrapper initialSession={session} />

          {/* Main content with top padding to account for fixed navbar */}
          <main className="pt-16 sm:pt-16 md:pt-16">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}