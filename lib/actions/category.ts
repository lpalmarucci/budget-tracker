"use server";

import { redirect } from "next/navigation";
import { CategorySchema, CategorySchemaType } from "@/lib/schema/Category.schema";
import { getSession } from "@/auth";
import db from "@/lib/db";

export async function createCategory({ type, icon, name }: CategorySchemaType) {
  const parsedBody = CategorySchema.safeParse({ type, icon, name });
  if (!parsedBody.success) throw parsedBody.error;

  const session = await getSession();

  if (!session) {
    redirect("/auth/signin");
    return;
  }

  const cat = await db.category.findFirst({
    where: {
      name: name,
      userId: session.user.id as string,
      type,
    },
  });

  if (cat) return { message: `A category with name ${name} already exists` };

  return db.category.create({
    data: {
      name: name,
      userId: session.user.id as string,
      type,
      icon: icon,
    },
  });
}
