import { getSession } from "@/auth";
import { redirect } from "next/navigation";
import db from "@/lib/db";
import { NextResponse } from "next/server";
import { getDaysInMonth } from "date-fns";
import { TimeframeHistoryType } from "@/components/overview/HistoryPeriodSelector";

export type HistoryData = {
  income: number;
  expense: number;
  year: number;
  month: number;
  day?: number;
};

export async function GET(request: Request) {
  const session = await getSession();

  if (!session) redirect("/auth/signin");

  const { searchParams } = new URL(request.url);
  const timeframe = searchParams.get("timeframe") as TimeframeHistoryType;
  const month = Number(searchParams.get("month"));
  const year = Number(searchParams.get("year"));

  if (!timeframe || (timeframe === "month" && !month) || (timeframe === "year" && (!year || !month)))
    throw new Error("Check the provided month or year");

  const data = await getHistoryData(session.user.id, timeframe, year, month);
  return NextResponse.json(data);
}

async function getHistoryData(userId: string, timeframe: TimeframeHistoryType, year: number, month: number) {
  switch (timeframe) {
    case "month":
      return getYearAndMonthData(userId, year, month);
    case "year":
      return getYearData(userId, year);
  }
}

async function getYearData(userId: string, year: number) {
  const result = await db.yearHistory.groupBy({
    by: ["month", "year"],
    where: {
      userId,
      year,
    },
    _sum: {
      income: true,
      expense: true,
    },
    orderBy: {
      month: "asc",
    },
  });

  if (!result || result.length === 0) return [];

  const history: HistoryData[] = [];
  for (let i = 0; i < 12; i++) {
    let expense = 0,
      income = 0;

    const month = result.find((r) => r.month == i);
    if (month) {
      income = month._sum.income || 0;
      expense = month._sum.expense || 0;
    }

    history.push({
      year,
      month: i,
      income,
      expense,
    });
  }

  return history;
}

async function getYearAndMonthData(userId: string, year: number, month: number) {
  const result = await db.monthHistory.groupBy({
    by: ["day", "month", "year"],
    where: {
      userId,
      year,
      month,
    },
    _sum: {
      income: true,
      expense: true,
    },
    orderBy: {
      day: "asc",
    },
  });

  if (!result || result.length === 0) return [];

  const history: HistoryData[] = [];
  for (let i = 0; i < getDaysInMonth(new Date(year, month)); i++) {
    let expense = 0,
      income = 0;

    const day = result.find((r) => r.day == i);
    if (day) {
      income = day._sum.income || 0;
      expense = day._sum.expense || 0;
    }

    history.push({
      year,
      month,
      day: i,
      income,
      expense,
    });
  }

  return history;
}
