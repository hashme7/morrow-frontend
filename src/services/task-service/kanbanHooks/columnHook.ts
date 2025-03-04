import { useState } from "react";
import { IColumn } from "../../../types/board/board";
import mongoose from "mongoose";

export const useColumn = ({
  column,
  addTask,
  handleColumnNameUpdate,
  isOver,
}: {
  column: Omit<IColumn, "team_id">;
  addTask: (
    name: string,
    id: string,
    priority: string,
    status: string,
    addTask: { _id: mongoose.Types.ObjectId }[]
  ) => void;
  handleColumnNameUpdate: (
    e: React.KeyboardEvent<HTMLDivElement>,
    name: string,
    id: string
  ) => void;
  isOver: boolean;
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
  return {
    isEditing,
    newName,
    isTaskFormOpen,
    taskName,
    priority,
    isAssigneeOpen,
    Assignees,
    columnStyle,
    setIsEditing,
    setNewName,
    setTaskFormOpen,
    setTaskName,
    setPriority,
    setIsAssigneeOpen,
    setAssignees,
    handleNameUpdate,
    toggleAssigneeModal,
    handleTaskSave,
  };
};
