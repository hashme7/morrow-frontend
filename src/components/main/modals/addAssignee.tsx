import { Input } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { FaUser } from "react-icons/fa";
import { IUser } from "../../../types/member";
import mongoose from "mongoose";

interface AddAssigneeProps {
  members: IUser[];
  setIsOpen: (open: boolean) => void;
  Assignees: { _id: mongoose.Types.ObjectId }[];
  setAssignees: React.Dispatch<
    React.SetStateAction<{ _id: mongoose.Types.ObjectId }[]>
  >;
}

export const AddAssignee: React.FC<AddAssigneeProps> = ({
  members,
  setIsOpen,
  Assignees,
  setAssignees,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<IUser[]>(members);

  useEffect(() => {
    setFilteredUsers(
      members.filter((member: IUser) =>
        member.username.toLowerCase().includes(searchQuery.toLowerCase()) && !Assignees.includes(member)
      )
    );
  }, [members,searchQuery]);

  console.log(Assignees, "jfksajdfk", filteredUsers);

  return (
    <div className="block top-full left-0 w-full bg-black shadow-md rounded-md p-2 ">
      <div className="flex items-center gap-2 mb-2 overflow-auto">
        <FaUser />
        <Input
          type="text"
          size="sm"
          value={searchQuery}
          variant="bordered"
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-grow"
          placeholder="Search members"
        />
      </div>

      <div className="max-h-20 overflow-y-auto">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <div
              key={user._id.toString()}
              className="flex items-center space-x-2 p-2 hover:ring-zinc-700 cursor-pointer rounded-md"
              onClick={() => {
                setAssignees([...Assignees, user._id]);
                setIsOpen(false);
              }}
            >
              <FaUser />
              <span className="text-ellipsis">{user.username}</span>
            </div>
          ))
        ) : (
          <p className="text-zinc-600 text-sm ">No users found.</p>
        )}
      </div>
    </div>
  );
};
