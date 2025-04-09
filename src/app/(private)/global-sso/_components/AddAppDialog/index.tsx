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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const apiClient = new ApiClient();

const FormSchema = z.object({
  name: z.string().min(1, "Required"),
  alias: z.string().min(1, "Required"),
});

type FormType = z.infer<typeof FormSchema>;

type DialogProps = {
  open: boolean;
  onOpenChange: () => void;
  onSubmit: (data: FormType) => void;
};

export default function AddAppDialog(props: DialogProps) {
  const { open, onOpenChange } = props;

  const form = useForm<FormType>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      alias: "",
    },
  });

  const handleModalClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.stopPropagation();
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
          <form
            className="space-y-4"
            onSubmit={form.handleSubmit(() => {
              onOpenChange();
              props.onSubmit(form.getValues());
              form.reset();
            })}
          >
            <ControlledInput name="name" label="Name" placeholder="App name" />
            <ControlledInput
              name="alias"
              label="Alias"
              placeholder="App alias"
            />
            <Button className="w-full mt-4">Save</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
