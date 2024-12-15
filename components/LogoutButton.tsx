"use client";

import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { ExitIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";

function LogoutButton({ className }: { className?: string }) {
  const { data: session, status } = useSession();

  if (status === "unauthenticated" || !session) return;

  return (
    <Button
      variant="outline"
      className={cn(className, "border-rose-700 text-rose-700 hover:text-rose-600 hover:border-rose-600")}
      onClick={() => signOut({ redirect: true })}
    >
      <ExitIcon />
      Logout
    </Button>
  );
}

export default LogoutButton;
