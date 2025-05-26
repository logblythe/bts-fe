"use client";

import ApiClient from "@/api-client/";
import { TooltipWrapper } from "@/components/TooltipWrapper";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { useEventStore } from "@/store/event-store";
import { EventType } from "@/type/event-type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Trash2 } from "lucide-react";
import { useState } from "react";

const apiClient = new ApiClient();

const EventAction = ({ event }: { event: EventType }) => {
  const { selectedEventId: activeEventId } = useEventStore();

  const [webhookEnabled, setWebhookEnabled] = useState(
    event.existsInWebhook ?? false
  );

  const queryClient = useQueryClient();

  const [currentConfigId, setCurrentConfigId] = useState(event.configId ?? "-");

  const { data: configs = [] } = useQuery({
    queryKey: ["configs"],
    queryFn: () => apiClient.getConfigs(),
  });

  const updateEventConfigId = useMutation({
    mutationFn: ({ configId }: { configId: string }) =>
      apiClient.updateEventConfig(event.id, { ...event, configId }),
    mutationKey: ["event", event.id, "updateConfigId"],

    onSuccess: () => {
      toast({
        description: (
          <p>
            Config assigned to <b>{event.name}</b>
          </p>
        ),
      });
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => apiClient.deleteEventById(event.id),
    mutationKey: ["event", event.id, "delete"],
    onSuccess: () => {
      toast({
        description: (
          <p>
            Your event <b>{event.name}</b> has been deleted
          </p>
        ),
      });
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });

  const toggleWebhookMutation = useMutation({
    mutationFn: async (enabled: boolean) => {
      if (enabled) {
        await apiClient.activateEventWebhook(event.id);
      } else {
        await apiClient.deactivateEventWebhook(event.id);
      }
    },
    onError: (error) => {
      toast({
        description: "Webhook call failed.",
        variant: "destructive",
      });
    },
    onSuccess: (_, enabled) => {
      toast({
        description: (
          <p>
            Webhook {enabled ? "activated" : "deactivated"} for{" "}
            <b>{event.name}</b>
          </p>
        ),
      });
    },
  });

  const handleWebhookToggle = (checked: boolean | "indeterminate") => {
    const isChecked = checked === true;
    setWebhookEnabled(isChecked);
    toggleWebhookMutation.mutate(isChecked);
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-auto">
      <Select
        onValueChange={(configId) => {
          setCurrentConfigId(configId);
          updateEventConfigId.mutate({ configId });
        }}
        value={currentConfigId}
      >
        <SelectTrigger className="w-[200px] text-xs rounded-lg">
          <SelectValue placeholder="Select sso setup" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {configs.map(({ id, details }) => (
              <SelectItem key={id} value={id}>
                {details.appName}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <Loader2
        className={`h-4 w-4 animate-spin ${
          updateEventConfigId.isPending ? "inline-flex" : "invisible"
        }`}
      />

      <div className="flex items-center gap-2">
        <div className="w-5 h-5 flex items-center justify-center shrink-0 relative">
          <Checkbox
            checked={webhookEnabled}
            onCheckedChange={handleWebhookToggle}
            className="h-4 w-4 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{
              visibility: toggleWebhookMutation.isPending
                ? "hidden"
                : "visible",
            }}
          />
          <Loader2
            className="w-4 h-4 animate-spin text-muted-foreground absolute "
            style={{
              visibility: toggleWebhookMutation.isPending
                ? "visible"
                : "hidden",
            }}
          />
        </div>
        <span className="text-sm whitespace-nowrap">Add to WebHook</span>
      </div>

      <div className=" ml-2 ">
        <TooltipWrapper content={"Delete"}>
          <Button
            variant="outline"
            size="icon"
            className="text-red-500 ml-4 mr-4"
            disabled={activeEventId === event.id}
            onClick={(e) => {
              e.stopPropagation();
              deleteMutation.mutate();
            }}
          >
            {deleteMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
          </Button>
        </TooltipWrapper>
      </div>
    </div>
  );
};

export default EventAction;
