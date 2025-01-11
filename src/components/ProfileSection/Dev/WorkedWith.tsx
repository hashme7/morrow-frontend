import { Avatar, AvatarGroup } from "@nextui-org/avatar";
import React from "react";
import { FaUsers } from "react-icons/fa";

const WorkWith: React.FC = () => {
  return (
    <>
      <div className="relative bg-zinc-800 m-1 rounded-large p-1 h-auto">
        <h3 className="font-bold p-2">Worked With</h3>
        <p className="text-small">didn't work with anyone</p>
        <span className="absolute right-0 top-0 p-3">
          <FaUsers className="text-xl" />
        </span>
        <div className="flex gap-4 items-center p-2 hover:cursor-pointer">
          <AvatarGroup isBordered max={3}>
            <Avatar
              isBordered
              radius="full"
              size="sm"
              src="https://i.pravatar.cc/150?u=a04258114e29026708c"
            />
            <Avatar
              isBordered
              radius="full"
              size="sm"
              src="https://i.pravatar.cc/150?u=a04258114e29026708c"
            />
            <Avatar
              isBordered
              radius="full"
              size="sm"
              src="https://i.pravatar.cc/150?u=a04258114e29026708c"
            />
            <Avatar
              isBordered
              radius="full"
              size="sm"
              src="https://i.pravatar.cc/150?u=a04258114e29026708c"
            />
          </AvatarGroup>
        </div>
      </div>
    </>
  );
};

export default WorkWith;
