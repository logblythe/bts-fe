"use client";

import { useEventStore } from "@/store/event-store";
import { EventType } from "@/type/event-type";
import Link from "next/link";

export const EventNameCell = ({ event }: { event: EventType }) => {
  const { selectEvent } = useEventStore();

  return (
    <Link
      href={`/events/${event.id}`}
      scroll={false}
      onClick={(e) => {
        selectEvent(event);
      }}
    >
      <span>{event.name}</span>
    </Link>
  );
};
