"use client";

import ApiClient from "@/api-client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import React, { useState } from "react";

const apiClient = new ApiClient();

export const Configurations = () => {
  const queryClient = useQueryClient();

  const { selectedEvent } = useEventStore();

  const [dynamicsEvent, setDynamicsEvent] = useState(
    selectedEvent!.dynamicsEvent ?? ""
  );
  const [memberCategoryField, setMemberCategoryField] = useState(
    selectedEvent!.memberCategoryField ?? "None"
  );
  const [memberStatusField, setMemberStatusField] = useState(
    selectedEvent!.memberStatusField ?? "None"
  );

  const msEventsQuery = useQuery<Array<{ id: string; name: string }>>({
    queryKey: ["ms-events"],
    queryFn: () => apiClient.getMsDynamicEvents(),
  });

  const msEvents = msEventsQuery.data ?? [];

  const updateEventConfig = useMutation({
    mutationFn: ({
      dynamicsEvent,
      memberCategoryField,
      memberStatusField,
    }: {
      dynamicsEvent: string;
      memberCategoryField: string;
      memberStatusField: string;
    }) =>
      apiClient.updateEventConfig(selectedEvent!.id, {
        ...selectedEvent!,
        dynamicsEvent,
        memberCategoryField,
        memberStatusField,
      }),
    mutationKey: ["event", selectedEvent!.id, "updateConfigId"],
    onSuccess: () => {
      toast({
        description: (
          <p>
            Config assigned to <b>{selectedEvent!.name}</b>
          </p>
        ),
      });
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });

  const handleModalClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.stopPropagation();
  };
  return (
    <div className="shadow-sm border rounded-md p-4 flex flex-col h-full justify-between bg-gray-50">
      <h4 className="text-[20px] font-medium leading-none peer pb-4">
        Update configurations
      </h4>
      <div className="space-y-4 p-2">
        <div className="flex flex-col space-y-2">
          <Label className="text-sm font-medium leading-none peer text-gray-500">
            MS Dynamic Event
          </Label>
          <Select
            value={dynamicsEvent}
            onValueChange={(value) => {
              setDynamicsEvent(value);
            }}
          >
            <SelectTrigger className="w-full md:w-[420px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="w-[420px]">
              <SelectGroup>
                {msEvents.map((event) => (
                  <SelectItem key={event.id} value={event.id}>
                    {event.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col space-y-2">
          <Label className="text-sm font-medium leading-none peer text-gray-500">
            Member Category Location
          </Label>
          <Select
            value={memberCategoryField}
            onValueChange={(value) => {
              setMemberCategoryField(value);
            }}
          >
            <SelectTrigger className="w-full md:w-[420px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="None">None</SelectItem>
                <SelectItem value="Sub Department">Sub Department</SelectItem>
                <SelectItem value="User Defined Field 1">
                  User Defined Field 1
                </SelectItem>
                <SelectItem value="User Defined Field 2">
                  User Defined Field 2
                </SelectItem>
                <SelectItem value="User Defined Field 3">
                  User Defined Field 3
                </SelectItem>
                <SelectItem value="User Defined Field 4">
                  User Defined Field 4
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col space-y-2">
          <Label className="text-sm font-medium leading-none peer text-gray-500">
            Member Status Location
          </Label>
          <Select
            value={memberStatusField}
            onValueChange={(value) => {
              setMemberStatusField(value);
            }}
          >
            <SelectTrigger className="w-full md:w-[420px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="None">None</SelectItem>
                <SelectItem value="Sub Department">Sub Department</SelectItem>
                <SelectItem value="User Defined Field 1">
                  User Defined Field 1
                </SelectItem>
                <SelectItem value="User Defined Field 2">
                  User Defined Field 2
                </SelectItem>
                <SelectItem value="User Defined Field 3">
                  User Defined Field 3
                </SelectItem>
                <SelectItem value="User Defined Field 4">
                  User Defined Field 4
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      <Button
        className="w-fit self-end px-8 my-4"
        disabled={updateEventConfig.isPending}
        onClick={() => {
          updateEventConfig.mutate({
            dynamicsEvent,
            memberCategoryField,
            memberStatusField,
          });
        }}
      >
        {updateEventConfig.isPending ? (
          <Loader2 className="w-4 h-4 animate-spin mr-2" />
        ) : null}
        Save
      </Button>
    </div>
  );
};
