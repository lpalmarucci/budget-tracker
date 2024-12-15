"use client";

import Logo from "@/components/Logo";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { useState } from "react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import LogoutButton from "@/components/LogoutButton";

type NavbarItemType = {
  label: string;
  link: string;
};

const ITEMS: NavbarItemType[] = [
  {
    label: "Dashboard",
    link: "/",
  },
  {
    label: "Transactions",
    link: "/transactions",
  },
  {
    label: "Manage",
    link: "/manage",
  },
];

function Navbar() {
  return (
    <>
      <DesktopNavbar />
      <MobileNavbar />
    </>
  );
}

function DesktopNavbar() {
  return (
    <div className="hidden border-separate border-b lg:block">
      <nav className="container mx-auto flex items-center justify-between px-8">
        <div className="w-full flex h-[80px] min-h-[60px] items-center gap-x-4 justify-between">
          <div className="w-full flex items-center gap-x-4">
            <Logo />
            <div className="flex h-full ml-8">
              {ITEMS.map((item) => (
                <NavbarItem key={item.link} {...item} />
              ))}
            </div>
          </div>
          <LogoutButton />
        </div>
      </nav>
    </div>
  );
}

function MobileNavbar() {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div className="block lg:hidden w-full border-separate">
      <nav className="container w-full flex gap-4 items-center justify-between mx-auto px-4">
        <div className="flex items-center gap-4">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetTitle></SheetTitle>
            <SheetContent side="left" className="flex flex-col justify-between">
              <div className="flex flex-col w-full h-full">
                <Logo />
                <div className="flex flex-col gap-1 pt-4">
                  {ITEMS.map((item) => (
                    <NavbarItem key={item.link} {...item} />
                  ))}
                </div>
              </div>
              <LogoutButton />
            </SheetContent>
          </Sheet>
          <div className="flex h-[80px] min-h-[60px] items-center gap-4">
            <Logo />
          </div>
        </div>
      </nav>
    </div>
  );
}

function NavbarItem({ link, label }: NavbarItemType) {
  const pathname = usePathname();
  const isActive = pathname === link;
  return (
    <div className="relative flex items-center">
      <Link
        href={link}
        className={cn(
          buttonVariants({ variant: "ghost", className: "text-xl" }),
          "w-full justify-start text-muted-foreground text-lg",
          isActive && "text-foreground",
        )}
      >
        {label}
      </Link>
      {isActive && (
        <div className="absolute -bottom-[2px] left-1/2 h-[2px] w-[80%] -translate-x-1/2 rounded-xl bg-foreground md:block hidden"></div>
      )}
    </div>
  );
}

export default Navbar;
