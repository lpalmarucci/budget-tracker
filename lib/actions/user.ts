"use server";

import SignupSchema from "@/lib/schema/Signup.schema";
import * as z from "zod";
import db from "@/lib/db";
import * as bcrypt from "bcrypt";
import { redirect } from "next/navigation";

export async function createUser(prevState: any, formData: FormData) {
  const body = {
    email: formData.get("email"),
    password: formData.get("password"),
    name: formData.get("name"),
  } as z.infer<typeof SignupSchema>;

  const parsedBody = SignupSchema.safeParse(body);
  if (!parsedBody.success) throw parsedBody.error;

  const user = await db.user.findUnique({
    where: {
      email: body.email as string,
    },
  });

  if (user) throw new Error("User already exists");

  const hashedPassword = await bcrypt.hash(body.password, 10);

  await db.user.create({
    data: {
      email: body.email,
      name: body.name,
      password: hashedPassword,
    },
  });

  redirect("/auth/signin");
}
