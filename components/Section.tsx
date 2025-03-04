import { PropsWithChildren } from "react";

export function Section({ children }: PropsWithChildren) {
  return <div className="flex flex-col">{children}</div>;
}

export function SectionContent({ children }: PropsWithChildren) {
  return <div className="container mx-auto px-4">{children}</div>;
}

export function SectionHeader({ children }: PropsWithChildren) {
  return (
    <div className="border-b bg-card">
      <div className="container px-4 mx-auto w-full h-full flex flex-wrap justify-between items-center py-8">
        {children}
      </div>
    </div>
  );
}
