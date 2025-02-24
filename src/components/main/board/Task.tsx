import React, { useEffect, useState } from "react";
import { ITaskProps } from "../../../types/board/board";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPen,
  faEllipsisH,
  faPlus,
  faUserCircle,
} from "@fortawesome/free-solid-svg-icons";
import { useAppSelector } from "../../../store/hooks/hooks";
import { RootState } from "../../../store/store";
import { IUser } from "../../../types/member";
import { Avatar, AvatarGroup } from "@nextui-org/avatar";
import { Dropdown, DropdownItem, DropdownMenu,DropdownTrigger } from "@nextui-org/react";

export const Task: React.FC<ITaskProps> = ({ task, columnId }) => {
  console.log(columnId)
  const {
    setNodeRef,
    attributes,
    listeners,
    transition,
    transform,
    isDragging,
  } = useSortable({
    id: task._id.toString(),
    data: {
      type: "Task",
      task,
    },
  });
  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const { selectProject } = useAppSelector((state: RootState) => state.project);
  const { members } = useAppSelector((state: RootState) => state.members);
  const [assignedUsers, setAssignedUsers] = useState<IUser[]>([]);

  useEffect(() => {
    setAssignedUsers(
      members.filter((member) => task.assignee.includes(member._id.toString()))
    );
  }, [members]);
  if (isDragging) {
    return (
      <div className="bg-gray-400 text-white p-2 m-2 rounded-md cursor-pointer">
        <h4 className="font-bold">{task.name}</h4>
        <p>dragging</p>
        <p>{task.name}</p>
      </div>
    );
  }
  
  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className="bg-zinc-900  text-white m-1 rounded-md cursor-pointer ring-zinc-700 ring-1"
    >
      <div className="flex justify-between">
        <div className="flex flex-col">
          <h4 className="font-semibold text-sm pl-1 mt-1">{task.name}</h4>
          <small className="pl-1 font-thin">{selectProject?.name}</small>
        </div>
        <div className="w-2/5 ring-zinc-700 ring-1 rounded-md  flex  space-x-2 h-2/5 m-1 justify-evenly">
          <button className="">
            <FontAwesomeIcon icon={faPen} size="sm" />
          </button>
          <button>
            <FontAwesomeIcon icon={faPlus} size="sm" />
          </button>
          <button>
            <FontAwesomeIcon icon={faEllipsisH} size="sm" />
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        {/* Assignee Section */}
        <div className="p-2 flex justify-stretch gap-4">
          <div className="flex flex-col w-7">
            <FontAwesomeIcon
              icon={faUserCircle}
              size="xl"
              className="left-0 fa-user"
            />
            <small className="text-xs">Assignee</small>
          </div>
          <div className="flex justify-evenly align-middle left-4">
            <AvatarGroup size="lg">
              {assignedUsers.map((user) => (
                <Dropdown key={user._id.toString()}>
                  <DropdownTrigger>
                    <Avatar
                      size="sm"
                      className="w-7 h-7 cursor-pointer"
                      isBordered
                      src={user.image}
                    />
                  </DropdownTrigger>
                  <DropdownMenu className="w-7 h-7">
                    <DropdownItem key={user._id.toString()}>
                      <strong>{user.username}</strong>
                    </DropdownItem>
                    <DropdownItem key={user.email}>
                      Email: {user.email}
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              ))}
            </AvatarGroup>
          </div>
        </div>
        {/* priority */}
        <div className="p-2 flex items-center">
          <span className="text-xs font-thin">Priority: </span>
          <span
            className={`ml-2 px-2 py-1 rounded ${
              task.priority === "Urgent"
                ? "bg-red-500"
                : task.priority === "Normal"
                ? "bg-yellow-500"
                : "bg-green-500"
            }`}
          >
            {task.priority}
          </span>
        </div>
      </div>
    </div>
  );
};