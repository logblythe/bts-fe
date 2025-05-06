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

export const UpdateIndividualMemberCategory = () => {
  const [value, setValue] = useState("");

  const [selectedContactId, setSelectedContactId] = useState<string | null>(
    null
  );

  const { selectedEventId, selectedEvent } = useEventStore();

  const queryClient = useQueryClient();

  const updateIndividualMemberCategoryUrl = `${process.env.NEXT_PUBLIC_API_URL}${apiUrls.msdynamicEvents.updateMemberCategory}?eventId=${selectedEventId}&contactId=${selectedContactId}`;

  const updateIndividualMemberCategoryMutation = useMutation({
    mutationFn: () =>
      apiClient.updateIndividualMemberCategory(
        selectedEventId!,
        selectedContactId!
      ),
    mutationKey: ["event", selectedEventId!, "updateIndividualMemberCategory"],
    onSuccess: () => {
      toast({
        description: (
          <p>
            Individual member category update for event{" "}
            <b>{selectedEvent!.name}</b> has been triggered
          </p>
        ),
      });
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });

  const searchContactMutation = useMutation({
    mutationFn: () => {
      return apiClient.getContacts(selectedEventId!, value);
    },
  });

  const handleSearch = () => {
    if (value) {
      searchContactMutation.mutate();
    }
  };

  return (
    <div className="space-y-4 p-2">
      <div className="flex flex-row space-x-4 items-end ">
        <div className="flex flex-col space-y-2 ">
          <Label className="font-medium leading-none peer text-gray-500">
            Update Individual Member Category
          </Label>
          <div className="flex flex-col space-y-1">
            <div className="flex flex-row gap-4 w-fit">
              <Input
                value={value}
                onChange={(e) => {
                  setValue(e.target.value);
                }}
                placeholder="Search contact"
                className="w-full md:w-[420px]"
              />
              <Button
                className="px-8"
                onClick={handleSearch}
                disabled={searchContactMutation.isPending}
              >
                <div className="flex flex-row items-center">
                  {searchContactMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : null}
                  Search
                </div>
              </Button>
            </div>
            {value ? (
              <div className=" max-h-48 flex flex-col w-full md:w-[420px] items-start bg-white rounded-md shadow-md overflow-y-auto">
                {searchContactMutation.isPending ? (
                  <p className="text-sm text-gray-400 p-4">Loading...</p>
                ) : searchContactMutation.isError ? (
                  <p className="text-sm text-red-500 p-4">
                    {searchContactMutation.error.message}
                  </p>
                ) : searchContactMutation.isSuccess ? (
                  <div className=" flex flex-col space-y-2 rounded-b-sm w-full py-4">
                    {searchContactMutation.data.length === 0 ? (
                      <p className="text-sm text-gray-400 px-4">
                        No contacts found
                      </p>
                    ) : null}
                    {searchContactMutation.data.map(({ id, email }) => (
                      <div
                        key={id}
                        className="w-full text-sm flex flex-row text-gray-600 items-center justify-between px-4 py-2 rounded-md cursor-pointer hover:bg-gray-100"
                      >
                        <p
                          onClick={() => {
                            setSelectedContactId(id);
                            setValue("");
                          }}
                        >
                          {email}
                        </p>
                        <TooltipWrapper content={id}>
                          <InfoIcon className="w-4 h-4" />
                        </TooltipWrapper>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 p-4">
                    Search to get started
                  </p>
                )}
              </div>
            ) : null}
          </div>
          {selectedContactId ? (
            <div className="flex flex-row gap-2 items-start">
              <p className="text-sm">{updateIndividualMemberCategoryUrl}</p>
              <Button
                variant={"ghost"}
                size="icon"
                disabled={updateIndividualMemberCategoryMutation.isPending}
                onClick={(e) => {
                  e.stopPropagation();
                  updateIndividualMemberCategoryMutation.mutate();
                }}
              >
                {updateIndividualMemberCategoryMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Play className="h-4 w-4 text-green-800" />
                )}
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
