"use server";

import { Actions } from "./_components/actions";
import { Configurations } from "./_components/configurations";
import { Title } from "./_components/title";

const EventDetailPage = ({ params }: { params: { eventId: string } }) => {
  return (
    <div className="container mx-auto py-12 space-y-2">
      <Title />
      <div className="flex flex-col space-y-4">
        <Configurations />
        <Actions />
      </div>
    </div>
  );
};

export default EventDetailPage;
