"use client";

import ApiClient from "@/api-client/";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { EventType } from "@/type/event-type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useState } from "react";

const apiClient = new ApiClient();

type DialogProps = {
  open: boolean;
  onOpenChange: () => void;
  event: EventType;
};

export default function AssignDialog(props: DialogProps) {
  const { open, onOpenChange, event } = props;

  const queryClient = useQueryClient();

  const [dynamicsEvent, setDynamicsEvent] = useState(event.dynamicsEvent ?? "");
  const [memberCategoryField, setMemberCategoryField] = useState(
    event.memberCategoryField ?? "None"
  );
  const [memberStatusField, setMemberStatusField] = useState(
    event.memberStatusField ?? "None"
  );

  const msEventsQuery = useQuery<Array<{ id: string; name: string }>>({
    queryKey: ["ms-events"],
    queryFn: () => apiClient.getMsDynamicEvents(),
    enabled: open,
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
      apiClient.updateEventConfig(event.id, {
        ...event,
        dynamicsEvent,
        memberCategoryField,
        memberStatusField,
      }),
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
      onOpenChange();
    },
  });

  const handleModalClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.stopPropagation();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-[425px] sm:min-w-full lg:min-w-[720px] h-2/4 flex flex-col"
        onClick={handleModalClick}
      >
        <DialogHeader>
          <DialogTitle>Update configurations</DialogTitle>
          <DialogDescription>
            Select the configurations you want to assign to the event.
          </DialogDescription>
        </DialogHeader>
        <div className="shadow-sm border rounded-md p-4 flex flex-col  h-full justify-between">
          <div className="space-y-4 p-2">
            <div className="flex flex-col space-y-2">
              <Label className="text-sm font-medium leading-none peer">
                MS Dynamic Event
              </Label>
              <Select
                value={dynamicsEvent}
                onValueChange={(value) => {
                  setDynamicsEvent(value);
                }}
              >
                <SelectTrigger className="w-[420px]">
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
              <Label className="text-sm font-medium leading-none peer">
                Member Category Location
              </Label>
              <Select
                value={memberCategoryField}
                onValueChange={(value) => {
                  setMemberCategoryField(value);
                }}
              >
                <SelectTrigger className="w-[420px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="None">None</SelectItem>
                    <SelectItem value="Sub Department">
                      Sub Department
                    </SelectItem>
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
              <Label className="text-sm font-medium leading-none peer">
                Member Status Location
              </Label>
              <Select
                value={memberStatusField}
                onValueChange={(value) => {
                  setMemberStatusField(value);
                }}
              >
                <SelectTrigger className="w-[420px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="None">None</SelectItem>
                    <SelectItem value="Sub Department">
                      Sub Department
                    </SelectItem>
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
            className="w-fit self-end px-8"
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
      </DialogContent>
    </Dialog>
  );
}
