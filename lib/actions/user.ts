"use server";

import SignupSchema, { type SignupSchemaType } from "@/lib/schema/Signup.schema";
import db from "@/lib/db";
import * as bcrypt from "bcrypt";
import { redirect } from "next/navigation";

export async function createUser(prevState: any, formData: FormData) {
  const body = {
    username: formData.get("username"),
    password: formData.get("password"),
    name: formData.get("name"),
  } as SignupSchemaType;

  const parsedBody = SignupSchema.safeParse(body);
  if (!parsedBody.success) throw parsedBody.error;

  const user = await db.user.findMany({
    where: {
      username: body.username as string,
    },
  });

  if (!user || user.length > 0) throw new Error("User already exists");

  const hashedPassword = await bcrypt.hash(body.password, 10);

  await db.user.create({
    data: {
      username: body.username,
      name: body.name,
      password: hashedPassword,
    },
  });

  redirect("/auth/signin");
}
