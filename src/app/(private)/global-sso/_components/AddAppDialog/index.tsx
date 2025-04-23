"use client";

import ApiClient from "@/api-client/";
import { ControlledInput } from "@/components/ControlledInput";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const apiClient = new ApiClient();

const FormSchema = z.object({
  appName: z.string().min(1, "Required"),
  alias: z.string().min(1, "Required"),
});

type FormType = z.infer<typeof FormSchema>;

type DialogProps = {
  open: boolean;
  onOpenChange: () => void;
};

export default function AddAppDialog(props: DialogProps) {
  const { open, onOpenChange } = props;

  const queryClient = useQueryClient();

  const form = useForm<FormType>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      appName: "",
      alias: "",
    },
  });

  const handleModalClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.stopPropagation();
  };

  const createConfigMutation = useMutation({
    mutationFn: (data: FormType) => {
      const payload = {
        details: {
          appName: data.appName,
          alias: data.alias,
          url: "",
          redirectUri: "",
        },
      };
      return apiClient.createConfig(payload);
    },
    onSuccess: () => {
      form.reset();
      onOpenChange();
      toast({
        title: "Your app has been created",
        description: "Select the app to configure SSO",
      });
      queryClient.invalidateQueries({ queryKey: ["configs"] });
    },
    onError: (error) => {
      console.error("Error creating config:", error);
    },
  });

  const onSubmit = async (data: FormType) => {
    console.log("Form submitted", data);
    createConfigMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-[425px] sm:min-w-full lg:min-w-[720px] flex flex-col"
        onClick={handleModalClick}
      >
        <DialogHeader>
          <DialogTitle>Add new app</DialogTitle>
          <DialogDescription>
            Enter the information for the new app you want to add.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <ControlledInput
              name="appName"
              label="Name"
              placeholder="App name"
            />
            <ControlledInput
              name="alias"
              label="Alias"
              placeholder="App alias"
            />
            <Button
              className="w-full mt-4"
              disabled={createConfigMutation.isPending}
              onClick={form.handleSubmit(onSubmit)}
              type="submit"
            >
              {createConfigMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : null}
              Save
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
