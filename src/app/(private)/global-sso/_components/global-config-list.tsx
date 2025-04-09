"use client";

import ApiClient from "@/api-client/";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppStore } from "@/store/app-store";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Plus } from "lucide-react";
import { useState } from "react";
import AddAppDialog from "./AddAppDialog";
import { DetailsView } from "./details-view";
import { SettingsView } from "./settings-view";

type App = {
  name: string;
  alias: string;
};

const apiClient = new ApiClient();

const GlobalConfigList = () => {
  const [isOpen, setIsOpen] = useState(false);

  const { apps, addApp } = useAppStore();

  const { data = [], isLoading } = useQuery({
    queryKey: ["events"],
    queryFn: () => apiClient.getEvents(),
  });

  return (
    <div className="container mx-auto py-10 space-y-2">
      <div className="flex flex-row  justify-between items-end">
        <div className="flex flex-row space-x-4 items-center">
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
            <span>All Apps</span>
          </h3>
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
        </div>
        <Button
          onClick={(e) => {
            setIsOpen(!isOpen);
          }}
        >
          <Plus className="mr-2 h-4 w-4" /> Add App
        </Button>
      </div>
      <div className="shadow-sm border rounded-md p-4 flex flex-col space-y-4">
        <Select defaultValue="livessosetup">
          <SelectTrigger className="w-[360px]">
            <SelectValue placeholder="Select sso setup" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {apps.map((app) => (
                <SelectItem key={app.alias} value={app.alias}>
                  {app.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Tabs defaultValue="details" className="w-full">
          <TabsList>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="details">
            <DetailsView />
          </TabsContent>
          <TabsContent value="settings">
            <SettingsView />
          </TabsContent>
        </Tabs>
      </div>
      <AddAppDialog
        open={isOpen}
        onOpenChange={() => setIsOpen(!isOpen)}
        onSubmit={(data) => addApp(data as App)}
      />
    </div>
  );
};

export default GlobalConfigList;
