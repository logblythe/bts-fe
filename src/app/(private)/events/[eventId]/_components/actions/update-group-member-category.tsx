"use client";

import ApiClient from "@/api-client";
import { apiUrls } from "@/api-client/apiUrls";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { useEventStore } from "@/store/event-store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Play } from "lucide-react";
import { useState } from "react";

const apiClient = new ApiClient();

export const UpdateGroupMemberCategory = () => {
  const queryClient = useQueryClient();

  const [value, setValue] = useState("");

  const { selectedEventId, selectedEvent } = useEventStore();

  const updateGroupMemberCategoryUrl = `${process.env.NEXT_PUBLIC_API_URL}${apiUrls.msdynamicEvents.updateMemberCategory}?eventId=${selectedEventId}&group=${value}`;

  const updateGroupMemberCategoryMutation = useMutation({
    mutationFn: () =>
      apiClient.updateGroupMemberCategory(selectedEventId!, value),
    mutationKey: ["event", selectedEventId!, "updateMemberCategory"],
    onSuccess: () => {
      toast({
        description: (
          <p>
            Group member category update for event <b>{selectedEvent!.name}</b>{" "}
            has been triggered
          </p>
        ),
      });
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });

  const searchGroupMutation = useMutation({
    mutationFn: () => {
      return apiClient.getGroups(selectedEventId!, value);
    },
  });

  const handleSearch = () => {
    if (value) {
      searchGroupMutation.mutate();
    }
  };

  return (
    <div className="space-y-4 p-2">
      <div className="flex flex-row space-x-4 items-end ">
        <div className="flex flex-col space-y-2 ">
          <Label className="font-medium leading-none peer text-gray-500">
            Update Group Member Category
          </Label>
          <div className="flex flex-row gap-4 w-fit">
            <Input
              value={value}
              onChange={(e) => {
                searchGroupMutation.reset();
                setValue(e.target.value);
              }}
              placeholder="Search group"
              className="w-full md:w-[420px]"
            />
            <Button
              className="px-8"
              onClick={handleSearch}
              disabled={searchGroupMutation.isPending}
            >
              <div className="flex flex-row items-center">
                {searchGroupMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                Search
              </div>
            </Button>
          </div>
          {searchGroupMutation.data ? (
            searchGroupMutation.data?.success ? (
              <div className="flex flex-row gap-2 items-center">
                <p className="text-sm">{updateGroupMemberCategoryUrl}</p>
                <Button
                  variant={"ghost"}
                  size="icon"
                  disabled={updateGroupMemberCategoryMutation.isPending}
                  onClick={(e) => {
                    e.stopPropagation();
                    updateGroupMemberCategoryMutation.mutate();
                  }}
                >
                  {updateGroupMemberCategoryMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Play className="h-4 w-4 text-green-800" />
                  )}
                </Button>
              </div>
            ) : (
              <p className="text-sm text-red-500">
                No groups found for the search term
              </p>
            )
          ) : null}
        </div>
      </div>
    </div>
  );
};
