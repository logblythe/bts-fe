import ApiClient from "@/api-client";
import { ControlledInput } from "@/components/ControlledInput";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import { useNetworkErrorToast } from "@/hooks/useNetworkError";
import { ConfigType, StatusAndTransactionCodes } from "@/type/config-type";
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
  statusAndTransactionCodes: z.object({
    delegateConfirmed: z.string().min(1, "Required"),
    delegateProvisional: z.string().min(1, "Required"),
    delegateWaitList: z.string().min(1, "Required"),
    invoice: z.string().min(1, "Required"),
    creditNote: z.string().min(1, "Required"),
    paymentSource: z.string().min(1, "Required"),
    paymentType: z.string().min(1, "Required"),
    refundType: z.string().min(1, "Required"),
    paymentStatus: z.string().min(1, "Required"),
  }),
});

export type FormType = z.infer<typeof FormSchema>;

const apiClient = new ApiClient();

const convertToStatusAndTransactionCodes = (
  input: Record<string, string>
): StatusAndTransactionCodes => {
  return {
    delegateConfirmed: {
      type: "status",
      code: parseInt(input.delegateConfirmed, 10) || 0,
    },
    delegateProvisional: {
      type: "status",
      code: parseInt(input.delegateProvisional, 10) || 0,
    },
    delegateWaitList: {
      type: "status",
      code: parseInt(input.delegateWaitList, 10) || 0,
    },
    invoice: {
      type: "transaction",
      code: parseInt(input.invoice, 10) || 0,
    },
    creditNote: {
      type: "transaction",
      code: parseInt(input.creditNote, 10) || 0,
    },
    paymentSource: {
      type: "transaction",
      code: parseInt(input.paymentSource, 10) || 0,
    },
    paymentType: {
      type: "transaction",
      code: parseInt(input.paymentType, 10) || 0,
    },
    refundType: {
      type: "transaction",
      code: parseInt(input.refundType, 10) || 0,
    },
    paymentStatus: {
      type: "transaction",
      code: parseInt(input.paymentStatus, 10) || 0,
    },
  };
};

export const SettingsView = ({ config }: { config?: ConfigType | null }) => {
  const { showErrorToast } = useNetworkErrorToast();

  const queryClient = useQueryClient();

  const form = useForm<FormType>({
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
      statusAndTransactionCodes: {
        delegateConfirmed:
          config?.statusAndTransactionCodes?.delegateConfirmed?.code !==
          undefined
            ? String(config.statusAndTransactionCodes.delegateConfirmed.code)
            : "",
        delegateProvisional:
          config?.statusAndTransactionCodes?.delegateProvisional?.code !==
          undefined
            ? String(config.statusAndTransactionCodes.delegateProvisional.code)
            : "",
        delegateWaitList:
          config?.statusAndTransactionCodes?.delegateWaitList?.code !==
          undefined
            ? String(config.statusAndTransactionCodes.delegateWaitList.code)
            : "",
        invoice:
          config?.statusAndTransactionCodes?.invoice?.code !== undefined
            ? String(config.statusAndTransactionCodes.invoice.code)
            : "",
        creditNote:
          config?.statusAndTransactionCodes?.creditNote?.code !== undefined
            ? String(config.statusAndTransactionCodes.creditNote.code)
            : "",
        paymentSource:
          config?.statusAndTransactionCodes?.paymentSource?.code !== undefined
            ? String(config.statusAndTransactionCodes.paymentSource.code)
            : "",
        paymentType:
          config?.statusAndTransactionCodes?.paymentType?.code !== undefined
            ? String(config.statusAndTransactionCodes.paymentType.code)
            : "",
        refundType:
          config?.statusAndTransactionCodes?.refundType?.code !== undefined
            ? String(config.statusAndTransactionCodes.refundType.code)
            : "",
        paymentStatus:
          config?.statusAndTransactionCodes?.paymentStatus?.code !== undefined
            ? String(config.statusAndTransactionCodes.paymentStatus.code)
            : "",
      },
    },
  });

  const updateConfigMutation = useMutation({
    mutationFn: (data: FormType) => {
      const { id, ...rest } = config!;
      const { statusAndTransactionCodes } = data;

      const convertedStatusAndTransactionCodes =
        convertToStatusAndTransactionCodes(statusAndTransactionCodes);

      const payload = {
        ...rest,
        ...data,
        statusAndTransactionCodes: convertedStatusAndTransactionCodes,
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
        <h2 className="text-lg font-semibold mt-4">
          Status And Transaction Codes
        </h2>
        <ControlledInput
          name="statusAndTransactionCodes.delegateConfirmed"
          label="Delegate Confirmed Status Code"
          placeholder="Delegate Confirmed Status Code"
        />
        <ControlledInput
          name="statusAndTransactionCodes.delegateProvisional"
          label="Delegate Provisional Status Code"
          placeholder="Delegate Provisional Status Code"
        />
        <ControlledInput
          name="statusAndTransactionCodes.delegateWaitList"
          label="Delegate Wait List Status Code"
          placeholder="Delegate Wait List Status Code"
        />
        <ControlledInput
          name="statusAndTransactionCodes.invoice"
          label="Invoice Transaction Type"
          placeholder="Invoice Transaction Type"
        />
        <ControlledInput
          name="statusAndTransactionCodes.creditNote"
          label="Credit Note Transaction Type"
          placeholder="Credit Note Transaction Type"
        />
        <ControlledInput
          name="statusAndTransactionCodes.paymentSource"
          label="Payment Source"
          placeholder="Payment Source"
        />
        <ControlledInput
          name="statusAndTransactionCodes.paymentType"
          label="Payment Type"
          placeholder="Payment Type"
        />
        <ControlledInput
          name="statusAndTransactionCodes.refundType"
          label="Refund Type"
          placeholder="Refund Type"
        />
        <ControlledInput
          name="statusAndTransactionCodes.paymentStatus"
          label="Payment Status Code"
          placeholder="Payment Status Code"
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
