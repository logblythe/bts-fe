"use client";

import ApiClient from "@/api-client";
import { apiUrls } from "@/api-client/apiUrls";
import { TooltipWrapper } from "@/components/TooltipWrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { useEventStore } from "@/store/event-store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InfoIcon, Loader2, Play } from "lucide-react";
import { useState } from "react";

const apiClient = new ApiClient();

export const UpdateGroupMemberCategory = () => {
  const queryClient = useQueryClient();

  const [value, setValue] = useState("");

  const [selectCoordinatorId, setSelectedCoordinatorId] = useState<
    string | null
  >(null);

  const { selectedEventId, selectedEvent } = useEventStore();

  const updateGroupMemberCategoryUrl = `${process.env.NEXT_PUBLIC_API_URL}${apiUrls.msdynamicEvents.updateGroupMemberCategory}?eventId=${selectedEventId}&group=${selectCoordinatorId}`;

  const updateGroupMemberCategoryMutation = useMutation({
    mutationFn: () =>
      apiClient.updateGroupMemberCategory(
        selectedEventId!,
        selectCoordinatorId!
      ),
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
      <div className="flex flex-col space-y-4">
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
          {value ? (
            <div className=" max-h-48 flex flex-col w-full md:w-[420px] items-start bg-white rounded-md shadow-md overflow-y-auto">
              {searchGroupMutation.isPending ? (
                <p className="text-sm text-gray-400 p-4">Loading...</p>
              ) : searchGroupMutation.isError ? (
                <p className="text-sm text-red-500 p-4">
                  {searchGroupMutation.error.message}
                </p>
              ) : searchGroupMutation.isSuccess ? (
                <div className=" flex flex-col space-y-2 rounded-b-sm w-full py-4">
                  {searchGroupMutation.data.length === 0 ? (
                    <p className="text-sm text-gray-400 px-4">
                      No contacts found
                    </p>
                  ) : null}
                  {searchGroupMutation.data.map(
                    ({ coordinatorId, groupName }) => (
                      <div
                        key={coordinatorId}
                        className="w-full text-sm flex flex-row text-gray-600 items-center justify-between px-4 py-2 rounded-md cursor-pointer hover:bg-gray-100"
                      >
                        <p
                          onClick={() => {
                            setSelectedCoordinatorId(coordinatorId);
                            setValue("");
                          }}
                          className="w-full"
                        >
                          {groupName}
                        </p>
                        <TooltipWrapper content={coordinatorId}>
                          <InfoIcon className="w-4 h-4" />
                        </TooltipWrapper>
                      </div>
                    )
                  )}
                </div>
              ) : (
                <p className="text-xs text-gray-400 p-4">
                  Search to get started
                </p>
              )}
            </div>
          ) : null}
        </div>
        {selectCoordinatorId ? (
          <div className="flex flex-row gap-2 items-start">
            <p className="text-sm">{updateGroupMemberCategoryUrl}</p>
            <Button
              className="text-white rounded-full bg-green-500 min-w-10"
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
                <Play className="h-4 w-4 text-white" />
              )}
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
};
