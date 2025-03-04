import { Button } from "@/components/ui/button";
import CreateTransactionDialog from "@/components/CreateTransactionDialog";
import { Overview } from "@/components/overview/Overview";
import History from "@/components/overview/History";
import { getSession } from "@/auth";
import { Section, SectionContent, SectionHeader } from "@/components/Section";

export default async function Home() {
  const session = await getSession();

  if (!session) return;

  return (
    <Section>
      <SectionHeader>
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
      </SectionHeader>
      <SectionContent>
        <Overview />
        <History />
      </SectionContent>
    </Section>
  );
}
