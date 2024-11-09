import { Button } from "@/components/ui/button";
import { useFormStatus } from "react-dom";
import { PropsWithChildren } from "react";
import { cn } from "@/lib/utils";
import { LoaderIcon } from "lucide-react";

type SubmitButtonProps = {
  className?: string;
  loading?: boolean;
  disabled?: boolean;
  formId: string;
} & Readonly<PropsWithChildren>;

export default function SubmitButton({ formId, disabled, loading, children, className }: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button form={formId} className={cn(className, "w-full")} disabled={pending || loading || disabled}>
      {(loading || pending) && <LoaderIcon className="animate-spin" />}
      {children}
    </Button>
  );
}
