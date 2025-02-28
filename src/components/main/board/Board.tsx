import React, {
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Column } from "./Column";
import { PlusIcon } from "@heroicons/react/24/outline";
import { ITask } from "../../../types/board/board";
import AddColumnModal from "./createColumnModal";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { Task } from "./Task";
import { createPortal } from "react-dom";
import { SortableContext } from "@dnd-kit/sortable";
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
import { validateColumnName } from "../../../utils/validations/yup";
import { getTeamMembers } from "../../../store/slices/memberSlice";
import { Types } from "mongoose";
import extractIdFromToken from "../../../utils/decodeToken";

const KanbanBoard: React.FC = () => {
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
  }, [selectProject?.teamId, selectProject, columns]);
  useEffect(() => {
    if (selectProject) {
      dispatch(
        getTeamMembers({ projectId: selectProject.id.toString(), page: 1 })
      );
    }
  }, [selectProject]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );

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
      );
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
    e: FormEvent<HTMLFormElement>,
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

  const onDragStart = (event: DragStartEvent) => {
    console.log(event.active);
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
    }
  };

  const onDragEnd = (event: DragEndEvent) => {
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
          dispatch(
            updateTaskStatus({
              team_id: selectProject.teamId.toString(),
              id: activeId.toString(),
              status: over.data.current?.column._id.toString(),
            })
          );
        }
      }
    }
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      <div className="m-auto flex min-h-screen w-full overflow-x-auto overflow-y-auto px-[40px]">
        <div className="grid lg:grid-cols-4 grid-cols-2 gap-4 overflow-auto">
          <SortableContext items={columnsIds}>
            {columns.map((col) => (
                <Column
                  tasks={tasks}
                  key={col.id}
                  column={col}
                  addTask={addTask}
                  taskIds={taskIds}
                  handleColumnNameUpdate={handleColumnNameUpdate}
                  handleColumnDelete={handleColumnDelete}
                  error={error}
                  members={members}
                />
            ))}
          </SortableContext>
          <div className="flex-col">
              <button
                onClick={() => setColumnModal(true)}
                className="h-[60px] w-[250px] min-[w-250px] cursor-pointer rounded-lg bg-black ring-zinc-900 p-4 hover:ring-2 flex gap-2"
              >
                <PlusIcon className="w-6 h-6" />
                Add Column
              </button>
            <div>
              {columnModal && <AddColumnModal handleSubmit={addColumn} />}
            </div>
          </div>
        </div>
        {showModal && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0, 0, 0, 0.8)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1000,
            }}
          >
            <div
              style={{
                backgroundColor: "#1e1e1e",
                color: "#ffffff",
                padding: "20px",
                borderRadius: "8px",
                maxWidth: "400px",
                textAlign: "center",
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.5)",
              }}
            >
              <h2 style={{ marginBottom: "15px", fontSize: "18px" }}>
                Access Denied
              </h2>
              <p style={{ marginBottom: "20px", fontSize: "14px" }}>
                You do not have access to change the status of this task.
              </p>
              <button
                style={{
                  backgroundColor: "#ff4d4d",
                  color: "#fff",
                  padding: "10px 20px",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
                onClick={() => setShowModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
      {createPortal(
        <DragOverlay>
          {activeTask ? (
            <Task task={activeTask} columnId={activeTask.status} />
          ) : null}
        </DragOverlay>,
        document.body
      )}
    </DndContext>
  );
};

export default KanbanBoard;
