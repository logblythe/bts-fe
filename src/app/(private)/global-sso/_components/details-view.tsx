import { ControlledInput } from "@/components/ControlledInput";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";

export const DetailsView = () => {
  const form = useForm({});
  return (
    <Form {...form}>
      <form>
        <ControlledInput
          name="appName"
          label="App Name"
          placeholder="App name"
        />
        <ControlledInput name="alias" label="Alias" placeholder="Alias" />
        <ControlledInput name="url" label="Url" placeholder="Url" />
        <ControlledInput
          name="redirectUri"
          label="Redirect URI"
          placeholder="Redirect URI"
        />
      </form>
      <div className="flex flex-row justify-end">
        <Button className="mt-4">Save</Button>
      </div>
    </Form>
  );
};
