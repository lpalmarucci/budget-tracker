import Navbar from "@/components/Navbar";
import db from "@/lib/db";
import { redirect } from "next/navigation";
import { getSession } from "@/auth";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();

  if (!session) return;

  const userSettings = await db.userSettings.findFirst({
    where: { userId: session.user.id },
  });

  if (!userSettings) return redirect("/wizard");

  return (
    <div className="flex h-screen w-full flex-col ">
      <Navbar />
      <main>{children}</main>
    </div>
  );
}
