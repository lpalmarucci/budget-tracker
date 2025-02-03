import type { PropsWithChildren } from "react";
import SessionProvider from "@/components/providers/SessionProvider";
import { type Session } from "next-auth";
import { TanstackProvider } from "@/components/providers/TanstackProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import ProgressBarProvider from "@/components/providers/ProgressBarProvider";

type ProviderProps = {
  session: Session | null;
} & PropsWithChildren;
export default function RootProviders({ children, session }: ProviderProps) {
  return (
    <SessionProvider session={session}>
      <TanstackProvider>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <ProgressBarProvider>{children}</ProgressBarProvider>
        </ThemeProvider>
      </TanstackProvider>
    </SessionProvider>
  );
}
