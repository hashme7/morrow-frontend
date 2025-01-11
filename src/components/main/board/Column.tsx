import React, { useEffect, useState } from "react";
import { IColumnProps } from "../../../types/board/board";
import { DeleteIcon } from "../../../constants/icons/deletIcon/deleteIcon";
import { Task } from "./Task";
import { SortableContext } from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
} from "@nextui-org/react";
import { AddAssignee } from "../modals/addAssignee";
import mongoose from "mongoose";

export const Column: React.FC<IColumnProps> = ({
  column,
  addTask,
  tasks,
  taskIds,
  handleColumnNameUpdate,
  handleColumnDelete,
  error,
  members,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(column.name);
  const [isTaskFormOpen, setTaskFormOpen] = useState(false);
  const [taskName, setTaskName] = useState("");
  const [priority, setPriority] = useState("");
  const [isAssigneeOpen, setIsAssigneeOpen] = useState(false);
  const [Assignees, setAssignees] = useState<
    { _id: mongoose.Types.ObjectId }[]
  >([]);
  useEffect(() => {
    console.log("taskk cahnge")
  },[tasks])
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
    data: { type: "Column", column },
  });
  const columnStyle = isOver ? "border-blue-500" : "border-zinc-900";

  const handleNameUpdate = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleColumnNameUpdate(e, newName, column.id);
      setIsEditing(false);
      setNewName(column.name);
    }
  };

  const toggleAssigneeModal = () => setIsAssigneeOpen(!isAssigneeOpen);

  const handleTaskSave = () => {
    if (taskName.trim() && Assignees.length && priority) {
      addTask(
        taskName,
        taskName.trim(),
        priority,
        column._id.toString(),
        Assignees
      );
      setTaskFormOpen(false);
      setTaskName("");
      setPriority("");
      setAssignees([]);
    }
  };
  return (
    <div
      ref={setNodeRef}
      className={`w-[200px] h-fit flex flex-col rounded-xl border-2 p-2 ${columnStyle} `}
    >
      <div className="flex items-center justify-between">
        {isEditing ? (
          <div>
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={handleNameUpdate}
              className="w-full px-1 py-0.5 border rounded"
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
        ) : (
          <div
            className="m-1 text-white cursor-pointer"
            style={{ backgroundColor: column.color }}
            onClick={() => setIsEditing(true)}
          >
            {column.name}
          </div>
        )}
        <DeleteIcon
          className="cursor-pointer"
          onClick={() => handleColumnDelete(column.id)}
        />
      </div>

      <div className="overflow-y-auto max-h-[200px] flex flex-col">
        <SortableContext items={taskIds}>
          {tasks
            .filter((task) => task.status === column.id)
            .map((task) => (
              <Task
                key={task._id.toString()}
                task={task}
                columnId={task.status}
              />
            ))}
        </SortableContext>
      </div>

      {isTaskFormOpen ? (
        <div className="mt-2 p-2 rounded-xl ring-2 relative">
          <div className="flex flex-col gap-1">
            <Input
              size="sm"
              className="mb-2 text-white"
              type="text"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              placeholder="Task name"
              variant="bordered"
            />
            <Button
              onPress={toggleAssigneeModal}
              variant="bordered"
              size="sm"
              className="w-[160px]"
            >
              Add Assignee
            </Button>
            {isAssigneeOpen && (
              <AddAssignee
                members={members}
                setIsOpen={setIsAssigneeOpen}
                Assignees={Assignees}
                setAssignees={setAssignees}
              />
            )}

            <Dropdown>
              <DropdownTrigger>
                <Button variant="bordered" size="sm">
                  {priority || "Priority"}
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Priority Options"
                variant="faded"
                onAction={(key) => setPriority(key as string)}
              >
                <DropdownItem key="High">High</DropdownItem>
                <DropdownItem key="Normal">Normal</DropdownItem>
                <DropdownItem key="Low">Low</DropdownItem>
                <DropdownItem key="Urgent">Urgent</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
          <Button
            className="w-full mt-2 hover:bg-black"
            onPress={handleTaskSave}
          >
            Save
          </Button>
        </div>
      ) : (
        <Button
          onPress={() => setTaskFormOpen(true)}
          className="m-2 w-[40px] h-[20px] hover:bg-lime-950 bg-inherit border text-sm rounded-md"
        >
          + Add Task
        </Button>
      )}
    </div>
  );
};