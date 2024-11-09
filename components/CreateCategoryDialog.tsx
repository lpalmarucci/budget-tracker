"use client";

import { useForm } from "react-hook-form";
import { CategorySchema, type CategorySchemaType } from "@/lib/schema/Category.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CircleOff, PlusIcon } from "lucide-react";
import { DialogBody } from "next/dist/client/components/react-dev-overlay/internal/components/Dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import SubmitButton from "@/components/SubmitButton";
import * as React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import EmojiPicker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { createCategory } from "@/lib/actions/category";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { CheckIcon } from "@radix-ui/react-icons";

interface CreateCategoryDialogProps {
  type: CategorySchemaType["type"];
}

function CreateCategoryDialog({ type }: CreateCategoryDialogProps) {
  const form = useForm<CategorySchemaType>({
    mode: "onChange",
    resolver: zodResolver(CategorySchema),
    defaultValues: {
      name: "",
      icon: undefined,
      type,
    },
  });

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createCategory,
    onSuccess: (d) => {
      form.reset({ name: "", icon: undefined });

      toast({
        variant: "success",
        title: "Category created successfully",
        action: <CheckIcon className="text-emerald-600" />,
      });

      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (err) => {
      toast({
        variant: "destructive",
        title: err.message,
      });
    },
  });

  function onSubmit(values: CategorySchemaType) {
    mutation.mutate(values);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <PlusIcon /> create category
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <span className='"text-2xl" font-bold tracking-tighter'>
              Create new{" "}
              <span
                className={cn(
                  "bg-gradient-to-t bg-clip-text text-transparent",
                  type === "income" ? "from-emerald-700 to-emerald-400" : "from-rose-700 to-rose-400",
                )}
              >
                {type}
              </span>{" "}
              category
            </span>
          </DialogTitle>
        </DialogHeader>
        <DialogBody>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" id="create-category-form">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>Category name (required)</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="icon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Icon</FormLabel>
                    <FormControl>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="h-[100px] w-full">
                            {form.watch("icon") ? (
                              <em-emoji shortcodes={form.getValues().icon} size="40" />
                            ) : (
                              <div className="flex flex-col gap-2 text-muted-foreground items-center">
                                <CircleOff size={28} className="w-full h-full" />
                                Select an icon
                              </div>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent>
                          <EmojiPicker
                            data={data}
                            onEmojiSelect={(emoji: any) => field.onChange(emoji.shortcodes)}
                            searchPosition="none"
                          />
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormDescription>Category icon (required)</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <SubmitButton formId="create-category-form" disabled={!form.formState.isValid}>
                Create
              </SubmitButton>
            </form>
          </Form>
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
}

export default CreateCategoryDialog;
