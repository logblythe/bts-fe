"use client";

import ApiClient from "@/api-client/";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { useEventStore } from "@/store/event-store";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import EventDialog from "./EventDialog";
import { columns } from "./columns";

const apiClient = new ApiClient();

const EventsList = () => {
  const { selectedEventId } = useEventStore();
  const [isOpen, setIsOpen] = useState(false);
  const [rowSelection, setRowSelection] = useState({});

  const { data = [], isLoading } = useQuery({
    queryKey: ["events"],
    queryFn: () => apiClient.getEvents(),
  });

  useEffect(() => {
    if (data.length === 0) return;
    const index = data?.findIndex(
      (event) => event.id === selectedEventId
    ) as number;
    setRowSelection({ [index]: true });
  }, [data, selectedEventId]);

  return (
    <div className="container mx-auto py-10 space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
        <div className="flex flex-row items-center space-x-4">
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
            <span>All Events</span>
          </h3>
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
        </div>
        <Button
          onClick={(e) => {
            setIsOpen(!isOpen);
          }}
        >
          <Plus className="mr-2 h-4 w-4" /> Add Event
        </Button>
        <EventDialog
          open={isOpen}
          onOpenChange={() => {
            setIsOpen(!isOpen);
          }}
        />
      </div>
      <div className="overflow-x-auto">
        <DataTable
          columns={columns}
          data={data}
          rowSelection={rowSelection}
          onRowSelectionChange={setRowSelection}
        />
      </div>
    </div>
  );
};

export default EventsList;
