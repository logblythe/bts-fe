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
import { ConfigType } from "@/type/config-type";
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

  const [currentConfig, setCurrentConfig] = useState<ConfigType | null>(null);

  const { data: configs = [], isLoading } = useQuery({
    queryKey: ["configs"],
    queryFn: () => apiClient.getConfigs(),
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
        <Select
          onValueChange={(value) => {
            setCurrentConfig(configs.find((app) => app.id === value) || null);
          }}
          value={currentConfig?.id}
        >
          <SelectTrigger className="w-[360px]">
            <SelectValue placeholder="Select sso setup" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {configs.map((app) => (
                <SelectItem key={app.id} value={app.id}>
                  {app.details.appName}
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
            <DetailsView config={currentConfig} key={currentConfig?.id} />
          </TabsContent>
          <TabsContent value="settings">
            <SettingsView config={currentConfig} key={currentConfig?.id} />
          </TabsContent>
        </Tabs>
      </div>
      <AddAppDialog open={isOpen} onOpenChange={() => setIsOpen(!isOpen)} />
    </div>
  );
};

export default GlobalConfigList;
