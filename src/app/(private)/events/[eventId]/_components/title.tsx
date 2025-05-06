"use client";

import { useEventStore } from "@/store/event-store";

export const Title = () => {
  const { selectedEvent } = useEventStore();
  return (
    <div className="flex flex-row  justify-between items-end">
      <div className="flex flex-row space-x-4 items-center">
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          <span>{selectedEvent?.name}</span>
        </h3>
      </div>
    </div>
  );
};
