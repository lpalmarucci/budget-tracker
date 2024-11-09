import { getSession } from "@/auth";
import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(request: Request) {
  const session = await getSession();

  if (!session) {
    return NextResponse.redirect("/auth/signin");
  }

  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");

  const categories = await db.category.findMany({
    where: {
      userId: session.user.id,
      ...(type && { type }),
    },
  });

  return NextResponse.json(categories);
}
