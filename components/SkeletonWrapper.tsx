"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { PropsWithChildren } from "react";

interface SkeletonWrapperProps extends PropsWithChildren {
  isLoading: boolean;
  className?: string;
}

function SkeletonWrapper({ isLoading, className, children }: SkeletonWrapperProps) {
  if (isLoading) {
    return <Skeleton className={cn("w-full h-64", className)} />;
  }

  return children;
}

export default SkeletonWrapper;
