import { LogoImage } from "@/components/Logo";
import { SignUpForm } from "@/components/form/SignupForm";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function Page() {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center">
      <div className="container mx-auto max-w-xl flex flex-col justify-center items-center gap-8 px-8 md:px-0">
        <LogoImage />
        <SignUpForm />
        <div className="relative w-full">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t"></span>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
          </div>
        </div>
        <Link href="/auth/signin" className="w-full">
          <Button className="w-full" variant="outline">
            Sign in
          </Button>
        </Link>
      </div>
    </div>
  );
}
