import { getSession } from "@/auth";
import { redirect } from "next/navigation";

export default async function WizardPAge() {
  const session = await getSession();

  if (!session) return redirect("/api/auth/signin");

  return <div className="container flex max-w-2xl flex-col items-center gap-4">HELLOOOO</div>;
}
