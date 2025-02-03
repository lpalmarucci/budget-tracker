import type { Metadata } from "next";
import "./globals.css";
import { getSession } from "@/auth";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerRoot } from "@/components/ui/sonner";
import RootProviders from "@/components/providers";

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
        <RootProviders session={session}>
          <Toaster />
          <SonnerRoot />
          {children}
        </RootProviders>
      </body>
    </html>
  );
}
