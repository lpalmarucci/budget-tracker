import { getSession } from "@/auth";
import { redirect } from "next/navigation";
import db from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function GET(request: Request) {
  const session = await getSession();

  if (!session) redirect("/auth/signin");

  let usersSettings = await db.userSettings.findUnique({
    where: {
      userId: session.user.id,
    },
  });

  if (!usersSettings) {
    usersSettings = await db.userSettings.create({
      data: {
        userId: session.user.id,
        currency: "USD",
      },
    });
  }
  return Response.json(usersSettings);
}
