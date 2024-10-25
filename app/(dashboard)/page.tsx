import { getSession } from "@/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getSession();

  if (!session) return redirect("/api/auth/signin");

  return (
    <div className="min-h-[80px] h-full bg-gray-900">
      <div className="container mx-auto w-full h-full flex justify-between items-center px-8">
        <span className="text-2xl font-bold">Hello, {session.user?.name}</span>
      </div>
      {/*<AuthButton />*/}
    </div>
  );
}
