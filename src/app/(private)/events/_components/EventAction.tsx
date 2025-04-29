"use client";

import ApiClient from "@/api-client/";
import { TooltipWrapper } from "@/components/TooltipWrapper";
import { Button } from "@/components/ui/button";
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
import { Loader2, Pencil, Play, Trash2 } from "lucide-react";
import { useState } from "react";
import AssignDialog from "./AssignDialog";

const apiClient = new ApiClient();

const EventAction = ({ event }: { event: EventType }) => {
  const [isOpen, setIsOpen] = useState(false);

  const { selectedEventId: activeEventId } = useEventStore();

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

  const updateMemberCategoryMutation = useMutation({
    mutationFn: () => apiClient.updateMemberCategory(event.id),
    mutationKey: ["event", event.id, "updateMemberCategory"],
    onSuccess: () => {
      console.log("Member category updated");
      toast({
        description: (
          <p>
            Member category update for event <b>{event.name}</b> has been
            triggered
          </p>
        ),
      });
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });

  return (
    <div className="flex flex-row space-x-4 items-center">
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
      <Button
        variant="outline"
        size="icon"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
      >
        <Pencil className="h-4 w-4 text-blue-800" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        disabled={updateMemberCategoryMutation.isPending}
        onClick={(e) => {
          e.stopPropagation();
          updateMemberCategoryMutation.mutate();
        }}
      >
        {updateMemberCategoryMutation.isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Play className="h-4 w-4 text-green-800" />
        )}
      </Button>
      <TooltipWrapper content={"Delete"}>
        <Button
          variant="outline"
          size="icon"
          className="text-red-500"
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
      <AssignDialog
        open={isOpen}
        onOpenChange={() => {
          setIsOpen(!isOpen);
        }}
        event={event}
      />
    </div>
  );
};

export default EventAction;
