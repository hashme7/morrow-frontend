import React from "react";
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
  Tooltip,
} from "@nextui-org/react";
import { AddAssignee } from "../modals/addAssignee";
import { useColumn } from "../../../services/task-service/kanbanHooks/columnHook";

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
  const { setNodeRef, isOver } = useDroppable({
    id: column._id.toString(),
    data: { type: "Column", column },
  });

  const {
    setNewName,
    handleNameUpdate,
    setIsEditing,
    isTaskFormOpen,
    taskName,
    toggleAssigneeModal,
    setTaskName,
    isAssigneeOpen,
    setIsAssigneeOpen,
    priority,
    Assignees,
    setAssignees,
    setPriority,
    handleTaskSave,
    setTaskFormOpen,
    columnStyle,
    isEditing,
    newName,
  } = useColumn({ column, addTask, handleColumnNameUpdate, isOver });
  return (
    <Tooltip
      showArrow
      delay={1500}
      classNames={{
        base: ["before:bg-neutral-700 dark:before:bg-zinc-700"],
        content: [
          "py-2 px-4 shadow-xl",
          "text-black bg-gradient-to-br from-white to-neutral-400",
        ],
      }}
      content="Drag and drop tasks to different columns to update their status."
    >
      <div
        ref={setNodeRef}
        className={`sm:w-[200px] h-fit flex flex-col rounded-xl border-2 p-2 ${columnStyle} `}
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
              <button
                onClick={toggleAssigneeModal}
                className="border rounded border-zinc-800 sm:w-[160px] text-small text-zinc-400"
              >
                Add Assignee
              </button>
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
    </Tooltip>
  );
};
