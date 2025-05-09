"use client";

import { UpdateGroupMemberCategory } from "./update-group-member-category";
import { UpdateIndividualMemberCategory } from "./update-individual-member-category";
import { UpdateMemberCategory } from "./update-member-category";

export const Actions = () => {
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
