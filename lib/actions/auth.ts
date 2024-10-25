"use server";

import LoginSchema from "@/lib/schema/Login.schema";

export async function signIn(username: string, password: string) {
  const parsedBody = LoginSchema.safeParse({ username, password });

  if (!parsedBody.success) throw parsedBody.error;
}
