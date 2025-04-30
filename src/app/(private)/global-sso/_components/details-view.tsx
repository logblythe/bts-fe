import ApiClient from "@/api-client";
import { ControlledInput } from "@/components/ControlledInput";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import { useNetworkErrorToast } from "@/hooks/useNetworkError";
import { ConfigType } from "@/type/config-type";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const FormSchema = z.object({
  appName: z.string().min(1, "Required"),
  alias: z.string().min(1, "Required"),
});

export type FormType = z.infer<typeof FormSchema>;

const apiClient = new ApiClient();

export const DetailsView = ({ config }: { config?: ConfigType | null }) => {
  const queryClient = useQueryClient();

  const { showErrorToast } = useNetworkErrorToast();
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: config?.details,
  });

  const updateConfigMutation = useMutation({
    mutationFn: (details: FormType) => {
      const { id, ...rest } = config!;
      const payload = {
        ...rest,
        details,
      };
      return apiClient.updateConfig(id, payload);
    },
    onSuccess: () => {
      toast({
        description: (
          <p>
            Configuration <b>{config?.details.appName}</b> has been updated
          </p>
        ),
      });
      queryClient.invalidateQueries({ queryKey: ["configs"] });
    },
    onError: () => {
      showErrorToast("Failed to update SSO");
    },
  });

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    updateConfigMutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form>
        <ControlledInput
          name="appName"
          label="App Name"
          placeholder="App name"
        />
        <ControlledInput name="alias" label="Alias" placeholder="Alias" />
      </form>
      <div className="flex flex-row justify-end">
        <Button
          className="mt-4"
          onClick={form.handleSubmit(onSubmit)}
          disabled={updateConfigMutation.isPending}
        >
          {updateConfigMutation.isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : null}
          Save
        </Button>
      </div>
    </Form>
  );
};
