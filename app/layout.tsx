import type { Metadata } from "next";
import "./globals.css";
import SessionProvider from "@/components/providers/SessionProvider";
import { getSession } from "@/auth";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerRoot } from "@/components/ui/sonner";
import { TanstackProvider } from "@/components/providers/TanstackProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "BudgetTracker",
  description: "Track your expense easily with BudgetTracker 💸",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <SessionProvider session={session}>
          <TanstackProvider>
            <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
              <Toaster />
              <SonnerRoot />
              {children}
            </ThemeProvider>
          </TanstackProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
