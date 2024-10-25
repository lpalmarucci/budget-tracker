"use client";

import * as React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import LoginSchema from "@/lib/schema/Login.schema";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { signIn } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import SubmitButton from "@/components/SubmitButton";

function LoginForm() {
  const { toast } = useToast();
  const [isPending, setIsPending] = useState<boolean>(false);
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const router = useRouter();

  function onSubmit(values: z.infer<typeof LoginSchema>) {
    setIsPending(true);
    signIn("credentials", {
      redirect: false,
      email: values.email,
      password: values.password,
    })
      .then((res: any) => {
        if (!res.ok) {
          toast({
            description: res.error,
            variant: "destructive",
          });
        }
        router.push("/");
      })
      .catch((err: any) => {
        toast({
          description: err.message,
          variant: "destructive",
        });
        setIsPending(false);
      });
  }

  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
      </CardHeader>
      <CardContent className="px-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Email" {...field} />
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
                    <Input placeholder="Password" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <SubmitButton loading={isPending} disabled={!form.formState.isValid}>
              Sign in
            </SubmitButton>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export default LoginForm;
