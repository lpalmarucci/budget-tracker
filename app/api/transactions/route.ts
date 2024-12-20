import { getSession } from "@/auth";
import { NextResponse } from "next/server";
import db from "@/lib/db";
import { DateRangeSchema } from "@/lib/schema/date-range.schema";

export async function GET(request: Request) {
  const session = await getSession();

  if (!session) {
    return NextResponse.redirect("/auth/signin");
  }

  const { searchParams } = new URL(request.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const safeParse = DateRangeSchema.safeParse({ from, to });

  if (!safeParse.success) {
    return NextResponse.json({ message: safeParse.error.message }, { status: 400 });
  }

  // const categories = await db.category.findMany({
  //   where: {
  //     userId: session.user.id,
  //     ...(type && { type }),
  //   },
  // });

  const transactions = await getTransactions(safeParse.data.from, safeParse.data.to);
  return NextResponse.json(transactions);
}

function getTransactions(from: Date, to: Date) {
  return db.transaction.findMany({
    where: {
      date: {
        gte: from,
        lte: to,
      },
    },
    orderBy: {
      date: "desc",
    },
  });
}
