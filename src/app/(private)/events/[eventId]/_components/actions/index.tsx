"use client";

import ApiClient from "@/api-client";
import { apiUrls } from "@/api-client/apiUrls";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { useEventStore } from "@/store/event-store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Play } from "lucide-react";
import { UpdateGroupMemberCategory } from "./update-group-member-category";
import { UpdateIndividualMemberCategory } from "./update-individual-member-category";
import { UpdateMemberCategory } from "./update-member-category";

const apiClient = new ApiClient();

export const Actions = () => {
  const queryClient = useQueryClient();

  const { selectedEvent } = useEventStore();

  const updateMemberCategoryUrl = `${process.env.NEXT_PUBLIC_API_URL}${
    apiUrls.msdynamicEvents.updateMemberCategory
  }?eventId=${selectedEvent!.id}`;

  const updateMemberCategoryMutation = useMutation({
    mutationFn: () => apiClient.updateMemberCategory(selectedEvent!.id),
    mutationKey: ["event", selectedEvent!.id, "updateMemberCategory"],
    onSuccess: () => {
      toast({
        description: (
          <p>
            Member category update for event <b>{selectedEvent!.name}</b> has
            been triggered
          </p>
        ),
      });
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });

  const updateGroupMemberCategory = (
    <div className="space-y-4 p-2">
      <div className="flex flex-row space-x-4 items-end ">
        <div className="flex flex-col space-y-2 ">
          <Label className="font-medium leading-none peer text-gray-500">
            Update Group Member Category
          </Label>
          <p className="text-sm">{updateMemberCategoryUrl}</p>
        </div>
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
      </div>
    </div>
  );

  return (
    <div className="shadow-sm border rounded-md p-4 flex flex-col h-full justify-between bg-gray-50">
      <h4 className="text-[20px] font-medium leading-none peer pb-4">
        Actions
      </h4>
      <div className="space-y-4 p-2">
        <UpdateMemberCategory />
        <UpdateGroupMemberCategory />
        <UpdateIndividualMemberCategory />
      </div>
    </div>
  );
};
