import { useCallback, useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/hooks/hooks";
import {
  createColumn,
  createTask,
  deleteColumn,
  editColumnName,
  getColumn,
  getTasks,
  updateTaskStatus,
} from "../../../store/slices/BoardSlice";
import { getTeamMembers } from "../../../store/slices/memberSlice";
import { Types } from "mongoose";
import extractIdFromToken from "../../../utils/decodeToken";
import { validateColumnName } from "../../../utils/validations/yup";
import { ITask } from "../../../types/board/board";

export const useKanbanBoard = () => {
  const { columns, tasks } = useAppSelector((state) => state.tasks);
  const { selectProject } = useAppSelector((state) => state.project);
  const { members } = useAppSelector((state) => state.members);
  const [taskIds, setTaskIds] = useState<string[]>([]);
  const [activeTask, setActiveTask] = useState<ITask | null>(null);
  const [columnModal, setColumnModal] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);

  const columnsIds = useMemo(
    () => columns.map((column: any) => column._id.toString()),
    [columns]
  );

  const dispatch = useAppDispatch();

  const updateTaskIds = useCallback(
    () => setTaskIds(tasks.map((task: ITask) => task._id.toString())),
    [tasks]
  );

  useEffect(() => {
    if (selectProject) {
      dispatch(getColumn({ teamId: selectProject.teamId }));
      dispatch(getTasks({ team_id: selectProject.teamId }));
      updateTaskIds();
    }
  }, [selectProject?.teamId, selectProject]);
  // useEffect(() => {
  //   updateTaskIds();
  //   console.log("task changingin....")
  // },[tasks])

  useEffect(() => {
    if (selectProject) {
      dispatch(
        getTeamMembers({ projectId: selectProject.id.toString(), page: 1 })
      );
    }
  }, [selectProject, dispatch]);

  const addTask = async (
    name: string,
    id: string,
    priority: string,
    status: string,
    assignee: { _id: Types.ObjectId }[]
  ) => {
    if (selectProject?.teamId) {
      dispatch(
        createTask({
          name,
          id,
          priority,
          status,
          team_id: selectProject.teamId,
          assignee,
        })
      ).then(() => {
        updateTaskIds();
      });
    }
  };

  const handleColumnNameUpdate = async (
    e: React.KeyboardEvent<HTMLDivElement>,
    name: string,
    id: string
  ) => {
    const isDuplicate = columns.some(
      (col) => col.name === name && col.id !== id
    );
    if (isDuplicate) {
      setError("Can't create duplicate column!");
      return;
    }
    const validateError = await validateColumnName(name);
    if (validateError) {
      setError(validateError);
    }
    if (e.key === "Enter") {
      if (selectProject?.teamId) {
        dispatch(editColumnName({ name, id, team_id: selectProject?.teamId }));
      }
    }
  };

  const handleColumnDelete = (id: string) => {
    if (selectProject?.teamId) {
      dispatch(deleteColumn({ id, team_id: selectProject.teamId }));
    }
  };

  const addColumn = (
    e: React.FormEvent<HTMLFormElement>,
    statusName: string,
    selectedColor: string
  ) => {
    e.preventDefault();
    if (selectProject?.teamId) {
      dispatch(
        createColumn({
          name: statusName,
          color: selectedColor,
          team_id: selectProject.teamId,
          id: statusName.trim(),
        })
      );
      setColumnModal(false);
    }
  };

  const onDragStart = (event: any) => {
    for (let tsk of tasks) {
      if (event.active.id == tsk._id.toString()) {
        const userId = extractIdFromToken();
        if (userId) {
          if (!tsk.assignee.includes(userId)) {
            setShowModal(true);
            return;
          }
        }
      }
    }
    if (event.active.data.current?.type === "Task") {
      setActiveTask(event.active.data.current.task);
    } else {
      setActiveTask(null);
    }
  };
  const onDragOver = () => {
    // if (selectProject) {
    //   dispatch(getColumn({ teamId: selectProject.teamId }));
    //   dispatch(getTasks({ team_id: selectProject.teamId }));
    //   updateTaskIds();
    // }
  };

  const onDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over) return;
    for (let tsk of tasks) {
      if (event.active.id == tsk._id.toString()) {
        const userId = extractIdFromToken();
        if (userId) {
          if (!tsk.assignee.includes(userId)) {
            return;
          }
        }
      }
    }

    const activeId = active.id;
    const isActiveATask = active.data.current?.type === "Task";
    if (isActiveATask) {
      const isOverAColumn = over.data.current?.type === "Column";
      if (isOverAColumn) {
        if (selectProject) {
          console.log("onDragEnd", over.id.toString());

          dispatch(
            updateTaskStatus({
              team_id: selectProject.teamId.toString(),
              id: activeId.toString(),
              status: over.id.toString(),
            })
          );
          setActiveTask(null);
        }
      }
    }
  };

  return {
    columns,
    tasks,
    members,
    taskIds,
    activeTask,
    columnModal,
    error,
    showModal,
    columnsIds,
    setColumnModal,
    setShowModal,
    addTask,
    handleColumnNameUpdate,
    handleColumnDelete,
    addColumn,
    onDragStart,
    onDragEnd,
    onDragOver,
  };
};
