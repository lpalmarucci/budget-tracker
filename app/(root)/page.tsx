import { getSession } from "@/auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import CreateTransactionDialog from "@/components/CreateTransactionDialog";
import db from "@/lib/db";
import { Overview } from "@/components/overview/Overview";
import History from "@/components/overview/History";

export default async function Home() {
  const session = await getSession();

  if (!session) return;

  const userSettings = await db.userSettings.findFirst({
    where: { userId: session.user.id },
  });

  if (!userSettings) return redirect("/wizard");

  return (
    <div className="h-full bg-card">
      <div className="border-b bg-card">
        <div className="container px-4 mx-auto w-full h-full flex flex-wrap justify-between items-center gap-6 py-8">
          <span className="text-2xl font-bold">Hello, {session.user?.name}! 👋🏼</span>
          <div className="flex w-full md:w-fit items-center gap-4">
            <CreateTransactionDialog
              type="income"
              trigger={
                <Button
                  variant="outline"
                  className="border-emerald-500 bg-emerald-950 hover:bg-emerald-700 hover:text-white"
                >
                  New income 🤑
                </Button>
              }
            />
            <CreateTransactionDialog
              type="expense"
              trigger={
                <Button variant="outline" className="border-rose-500 bg-rose-950 hover:bg-rose-700 hover:text-white">
                  New expense 😤
                </Button>
              }
            />
          </div>
        </div>
      </div>
      <div className="container w-full mx-auto px-4 py-8 flex flex-col gap-8">
        <Overview />
        <History />
      </div>
    </div>
  );
}
