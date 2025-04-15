import React from "react";
import { Column } from "./Column";
import { PlusIcon } from "@heroicons/react/24/outline";
import AddColumnModal from "./createColumnModal";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { Task } from "./Task";
import { createPortal } from "react-dom";
import { SortableContext } from "@dnd-kit/sortable";
import { useKanbanBoard } from "../../../services/task-service/kanbanHooks/kanban";
import { IColumn } from "../../../types/board/board";

const KanbanBoard: React.FC = () => {
  const {
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
  } = useKanbanBoard();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );

  return (
    <DndContext
      sensors={sensors}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
    >
      <div className="m-auto flex min-h-screen w-full overflow-x-auto overflow-y-auto px-[40px]">
        <div className="grid lg:grid-cols-4 grid-cols-2 gap-4 overflow-auto">
          <SortableContext items={columnsIds}>
            {columns.map((col: Omit<IColumn, "team_id">) => (
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
            <Task task={activeTask}  />
          ) : null}
        </DragOverlay>,
        document.body
      )}
    </DndContext>
  );
};

export default KanbanBoard;
