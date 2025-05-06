"use client";

import CopyToClipboard from "@/components/copy-to-clipboard";
import { Checkbox } from "@/components/ui/checkbox";
import { EventType } from "@/type/event-type";
import { ColumnDef } from "@tanstack/react-table";
import { EventNameCell } from "./event-name-cell";
import EventAction from "./EventAction";

export const columns: ColumnDef<EventType>[] = [
  {
    id: "select",
    cell: ({ row }) =>
      row.getIsSelected() ? (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ) : null,
  },
  {
    accessorKey: "name",
    header: "Event Name",
    cell: ({ row }) => {
      return <EventNameCell event={row.original} />;
    },
  },
  {
    accessorKey: "url",
    header: "Url",
    cell: ({ row }) => {
      const event = row.original;
      const url = `${process.env.NEXT_PUBLIC_API_URL}/event?eventId=${event.id}`;
      return (
        <div className="flex flex-row items-center">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            {url}
          </a>
          <CopyToClipboard text={url} />
        </div>
      );
    },
  },
  {
    header: "Actions",
    cell: ({ row }) => {
      const event = row.original;
      return <EventAction event={event} />;
    },
  },
];
