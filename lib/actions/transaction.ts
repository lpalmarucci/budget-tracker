"use server";

import { getSession } from "@/auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
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

  const transaction = await db.transaction.create({
    data: {
      userId: session.user.id,
      amount: body.amount,
      type,
      category: body.category,
      categoryIcon: "",
      description: body.description,
      date: body.date,
    },
  });

  revalidatePath("/");
  return transaction;
}
