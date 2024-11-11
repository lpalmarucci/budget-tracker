import { getSession } from "@/auth";
import { NextResponse } from "next/server";
import db from "@/lib/db";
import { OverviewSchema } from "@/lib/schema/overview.schema";
import { endOfDay, startOfDay } from "date-fns";

export async function GET(req: Request) {
  const session = await getSession();

  if (!session) return NextResponse.redirect("/auth/signin");

  const { searchParams } = new URL(req.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  if (!from || !to) {
    return NextResponse.json({ message: "Provide a valid date range 📅" });
  }

  const safeParse = OverviewSchema.safeParse({ from, to });
  if (!safeParse.success) return NextResponse.json({ message: safeParse.error.message }, { status: 400 });

  const data = await getCategoriesStats(session.user.id, startOfDay(from), endOfDay(to));
  return NextResponse.json(data);
}

export type CategoriesStatsResponseType = Awaited<ReturnType<typeof getCategoriesStats>>;

async function getCategoriesStats(userId: string, from: Date, to: Date) {
  const data = await db.transaction.groupBy({
    by: ["type", "category", "categoryIcon"],
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
    orderBy: {
      _sum: {
        amount: "desc",
      },
    },
  });

  return data;
}
