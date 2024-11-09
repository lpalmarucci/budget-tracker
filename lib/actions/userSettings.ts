"use server";

import { UpdateUserCurrencySchema } from "@/lib/schema/UserSettings.schema";
import { getSession } from "@/auth";
import { redirect } from "next/navigation";
import db from "@/lib/db";
import { UserSettings } from "@prisma/client";

export async function updateUserCurrency({ userId, currency }: UserSettings): Promise<UserSettings> {
  const parsedBody = UpdateUserCurrencySchema.safeParse({ currency });

  if (!parsedBody.success) {
    throw parsedBody.error;
  }

  const session = await getSession();

  if (!session) redirect("/api/auth/sign-in");

  return db.userSettings.update({
    where: {
      userId: session.user.id,
    },
    data: {
      currency,
    },
  });
}

export async function getUserSettings(userId: string) {
  const session = await getSession();

  if (!session) redirect("/api/auth/sign-in");

  return db.userSettings.findUnique({ where: { userId } });
}
