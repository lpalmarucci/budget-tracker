import { getSession } from "@/auth";
import { NextResponse } from "next/server";
import db from "@/lib/db";
import { DateRangeSchema } from "@/lib/schema/date-range.schema";
import { endOfDay, startOfDay } from "date-fns";

export type GetBalanceStatusType = {
  income: number;
  expense: number;
};

export type GetBalanceStatusResponseType = GetBalanceStatusType | { message: string };

export async function GET(request: Request): Promise<NextResponse<GetBalanceStatusResponseType | unknown>> {
  const session = await getSession();

  if (!session) return NextResponse.redirect("/auth/signin");

  const { searchParams } = new URL(request.url);

  const from = searchParams.get("from");
  const to = searchParams.get("to");

  if (!from || !to) {
    return NextResponse.json({ message: "Provide a valid date range 📅" });
  }

  const safeParse = DateRangeSchema.safeParse({ from, to });
  if (!safeParse.success) return NextResponse.json({ message: safeParse.error.message }, { status: 400 });

  const data = await getBalanceStatus(session.user.id, startOfDay(from), endOfDay(to));
  return NextResponse.json(data);
}

async function getBalanceStatus(userId: string, from: Date, to: Date) {
  const totals = await db.transaction.groupBy({
    by: ["type"],
    _sum: {
      amount: true,
    },
    where: {
      userId,
      date: {
        gte: from,
        lte: to,
      },
    },
  });

  return {
    success: true,
    income: totals.find((d) => d.type === "income")?._sum.amount ?? 0,
    expense: totals.find((d) => d.type === "expense")?._sum.amount ?? 0,
  };
}
