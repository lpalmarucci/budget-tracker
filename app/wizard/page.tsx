import { getSession } from "@/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";
import { Separator } from "@/components/ui/separator";
import { CurrencyComboBox } from "@/components/CurrencyComboBox";
import Link from "next/link";
import { getUserSettings } from "@/lib/actions/userSettings";

export default async function WizardPage() {
  const session = await getSession();

  if (!session) return redirect("/api/auth/signin");

  const userSettings = await getUserSettings(session.user.id);

  if (userSettings) return redirect("/");

  return (
    <div className="container flex px-6 md:px-0 max-w-2xl flex-col items-center gap-8">
      <div className="w-full flex flex-col justify-center items-center gap-2">
        <h1 className="text-3xl">
          Welcome, <b className="leading-tight tracking-tighter">{session.user?.name?.split(" ").at(0)}! 👋🏼</b>
        </h1>
        <div className="w-full flex flex-col gap-2 justify-center items-center leading-4">
          <span className="text-muted-foreground">Let's get started by setting up your currency.</span>
          <span className="text-muted-foreground">You can change these settings any time later</span>
        </div>
      </div>
      <Separator />
      <div className="w-full flex flex-col gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Currency</CardTitle>
            <CardDescription>Set your default currency for transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <CurrencyComboBox />
          </CardContent>
        </Card>
        <Button className="w-full" asChild>
          <Link href="/" className="w-full">
            I'm done! take me to the dashboard
          </Link>
        </Button>
      </div>
      <Logo />
    </div>
  );
}
