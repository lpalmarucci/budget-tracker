"use server";

import { getSession } from "@/auth";
import { redirect } from "next/navigation";
import { TransactionSchema, TransactionSchemaType } from "@/lib/schema/Transaction.schema";
import db from "@/lib/db";
import { TransactionType } from "@/lib/types";

export async function createTransaction({ body, type }: { body: TransactionSchemaType; type: TransactionType }) {
  const parsedBody = TransactionSchema.safeParse(body);

  if (parsedBody.error) return { message: "Error while validating forms, please retry!" };

  const session = await getSession();

  if (!session) {
    redirect("/auth/signin");
    return;
  }

  const { description, amount, category, categoryIcon, date } = body;

  await db.$transaction([
    db.transaction.create({
      data: {
        userId: session.user.id,
        amount: amount,
        type,
        category: category,
        categoryIcon: categoryIcon,
        description: description,
        date: date,
      },
    }),
    db.monthHistory.upsert({
      create: {
        userId: session.user.id,
        expense: type === "expense" ? amount : 0,
        income: type === "income" ? amount : 0,
        day: date.getUTCDay(),
        month: date.getUTCMonth(),
        year: date.getUTCFullYear(),
      },
      where: {
        day_month_year_userId: {
          userId: session.user.id,
          day: date.getUTCDay(),
          month: date.getUTCMonth(),
          year: date.getUTCFullYear(),
        },
      },
      update: {
        expense: {
          increment: type === "expense" ? amount : 0,
        },
        income: {
          increment: type === "income" ? amount : 0,
        },
      },
    }),
    db.yearHistory.upsert({
      create: {
        userId: session.user.id,
        expense: type === "expense" ? amount : 0,
        income: type === "income" ? amount : 0,
        month: date.getUTCMonth(),
        year: date.getUTCFullYear(),
      },
      where: {
        month_year_userId: {
          userId: session.user.id,
          month: date.getUTCMonth(),
          year: date.getUTCFullYear(),
        },
      },
      update: {
        expense: {
          increment: type === "expense" ? amount : 0,
        },
        income: {
          increment: type === "income" ? amount : 0,
        },
      },
    }),
  ]);
}
