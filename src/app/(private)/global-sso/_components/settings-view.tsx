import { ControlledInput } from "@/components/ControlledInput";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";

export const SettingsView = () => {
  const form = useForm({});
  return (
    <Form {...form}>
      <form>
        <ControlledInput
          name="clientId"
          label="Client ID"
          placeholder="Client ID"
        />
        <ControlledInput
          name="clientSecret"
          label="Client Secret"
          placeholder="Client Secret"
        />
        <ControlledInput name="scope" label="Scope" placeholder="Scope" />
        <ControlledInput
          name="authorizationUrl"
          label="Authorization Url"
          placeholder="Authorization Url"
        />
        <ControlledInput
          name="accessTokenUrl"
          label="Access Token Url"
          placeholder="Access Token Url"
        />
        <ControlledInput
          name="userInfoUrl"
          label="User Info Url"
          placeholder="User Info Url"
        />
        <ControlledInput
          name="domainName"
          label="Domain Name"
          placeholder="Domain Name"
        />
        <ControlledInput
          name="apiVersion"
          label="API Version"
          placeholder="API Version"
        />
        <ControlledInput
          name="domainName"
          label="Tenant ID"
          placeholder="Tenant ID"
        />
        <ControlledInput
          name="domainName"
          label="Application ID"
          placeholder="Application ID"
        />
        <ControlledInput name="secret" label="Secret" placeholder="Secret" />
        <div className="flex flex-row justify-end">
          <Button className="mt-4">Save</Button>
        </div>
      </form>
    </Form>
  );
};
