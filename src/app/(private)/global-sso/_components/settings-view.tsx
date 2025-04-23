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
  identityProvider: z.object({
    clientId: z.string().min(1, "Required"),
    clientSecret: z.string().min(1, "Required"),
    scope: z.string().min(1, "Required"),
    authorizationUrl: z.string().min(1, "Required"),
    accessTokenUrl: z.string().min(1, "Required"),
    userInfoUrl: z.string().min(1, "Required"),
  }),
  msDynamics: z.object({
    domainName: z.string().min(1, "Required"),
    apiVersion: z.string().min(1, "Required"),
    tenantId: z.string().min(1, "Required"),
    applicationId: z.string().min(1, "Required"),
    secret: z.string().min(1, "Required"),
  }),
});

export type FormType = z.infer<typeof FormSchema>;

const apiClient = new ApiClient();

export const SettingsView = ({ config }: { config?: ConfigType | null }) => {
  const { showErrorToast } = useNetworkErrorToast();

  const queryClient = useQueryClient();

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      identityProvider: {
        clientId: config?.identityProvider?.clientId || "",
        clientSecret: config?.identityProvider?.clientSecret || "",
        scope: config?.identityProvider?.scope || "",
        authorizationUrl: config?.identityProvider?.authorizationUrl || "",
        accessTokenUrl: config?.identityProvider?.accessTokenUrl || "",
        userInfoUrl: config?.identityProvider?.userInfoUrl || "",
      },
      msDynamics: {
        domainName: config?.msDynamics?.domainName || "",
        apiVersion: config?.msDynamics?.apiVersion || "",
        tenantId: config?.msDynamics?.tenantId || "",
        applicationId: config?.msDynamics?.applicationId || "",
        secret: config?.msDynamics?.secret || "",
      },
    },
  });

  const updateConfigMutation = useMutation({
    mutationFn: (data: FormType) => {
      const { id, ...rest } = config!;
      const payload = {
        ...rest,
        ...data,
      };
      return apiClient.updateConfig(id, payload);
    },
    onSuccess: () => {
      toast({
        description: (
          <p>
            Your app <b>{config?.details.appName}</b> has been updated
          </p>
        ),
      });
      queryClient.invalidateQueries({ queryKey: ["configs"] });
    },
    onError: () => {
      showErrorToast("Failed to update SSO");
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    updateConfigMutation.mutate(data);
  }

  return (
    <Form {...form}>
      <form>
        <h2 className="text-lg font-semibold">Identity Provider</h2>
        <ControlledInput
          name="identityProvider.clientId"
          label="Client ID"
          placeholder="Client ID"
        />
        <ControlledInput
          name="identityProvider.clientSecret"
          label="Client Secret"
          placeholder="Client Secret"
        />
        <ControlledInput
          name="identityProvider.scope"
          label="Scope"
          placeholder="Scope"
        />
        <ControlledInput
          name="identityProvider.authorizationUrl"
          label="Authorization Url"
          placeholder="Authorization Url"
        />
        <ControlledInput
          name="identityProvider.accessTokenUrl"
          label="Access Token Url"
          placeholder="Access Token Url"
        />
        <ControlledInput
          name="identityProvider.userInfoUrl"
          label="User Info Url"
          placeholder="User Info Url"
        />
        <h2 className="text-lg font-semibold mt-4">MS Dynamics</h2>
        <ControlledInput
          name="msDynamics.domainName"
          label="Domain Name"
          placeholder="Domain Name"
        />
        <ControlledInput
          name="msDynamics.apiVersion"
          label="API Version"
          placeholder="API Version"
        />
        <ControlledInput
          name="msDynamics.tenantId"
          label="Tenant ID"
          placeholder="Tenant ID"
        />
        <ControlledInput
          name="msDynamics.applicationId"
          label="Application ID"
          placeholder="Application ID"
        />
        <ControlledInput
          name="msDynamics.secret"
          label="Secret"
          placeholder="Secret"
        />
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
      </form>
    </Form>
  );
};
