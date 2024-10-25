"use client";

import * as React from "react";
import { useFormState } from "react-dom";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import SignupSchema from "@/lib/schema/Signup.schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createUser } from "@/lib/actions/user";
import SubmitButton from "@/components/SubmitButton";

export function SignUpForm() {
  const form = useForm<z.infer<typeof SignupSchema>>({
    mode: "onChange",
    resolver: zodResolver(SignupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const [_, formAction] = useFormState(createUser, null);

  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle>Sign Up</CardTitle>
      </CardHeader>
      <CardContent className="px-8">
        <Form {...form}>
          <form action={formAction} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Enter your password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <SubmitButton disabled={!form.formState.isValid}>Create</SubmitButton>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
