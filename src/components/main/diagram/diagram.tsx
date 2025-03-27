import React from "react";
import {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  ReactFlow,
  ReactFlowProvider,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Button } from "@nextui-org/react";
import TableModal from "./tableModal";
import EditNodeModal from "./editNodeModal";
import { useDiagramLogic } from "../../../services/task-service/dbHooks/dbHook";
import { customNode } from "../../../services/task-service/dbHooks/dbHook";

const DiagramUI: React.FC = () => {
  const {
    nodes,
    edges,
    selectedNode,
    isOpen,
    isEditOpen,
    onOpen,
    onOpenChange,
    onEditOpenChange,
    handleInit,
    onNodesChange,
    onEdgesChange,
    onConnect,
    handleDeleteEdge,
    onNodeClick,
    handleAddTable,
    handleEditNode,
    handleDeleteNode,
    nodeTypes,
  } = useDiagramLogic();

  return (
    <>
      <div className="sm:w-fit bg-zinc-900 ml-4 mb-6 mr-4 rounded-2xl flex justify-center relative">
        <div
          style={{ width: "85vw", height: "90vh" }}
          className="rounded-2xl relative"
        >
          <ReactFlowProvider>
            <ReactFlow<customNode>
              nodes={nodes}
              onNodesChange={onNodesChange}
              colorMode="dark"
              className="rounded-2xl bg-zinc-900"
              onInit={handleInit}
              onConnect={onConnect}
              onEdgeClick={(event, edge) => {
                console.log(event);
                handleDeleteEdge(edge.id);
              }}
              edges={edges}
              fitView
              onEdgesChange={onEdgesChange}
              nodeTypes={nodeTypes}
              onNodeClick={(event, node) => onNodeClick(event, node)}
            >
              <MiniMap bgColor="black" />
              <Controls className="text-black" />
              <Background variant={BackgroundVariant.Dots} />
            </ReactFlow>
          </ReactFlowProvider>
          <div className="absolute top-4 right-4 z-10">
            <Button
              className="h-8 bg-white text-black font-medium"
              onPress={onOpen}
            >
              Add Table
            </Button>
          </div>
          {isOpen && (
            <TableModal
              isOpen={isOpen}
              onOpenChange={onOpenChange}
              handleAddTable={handleAddTable}
            />
          )}
          {isEditOpen && selectedNode && (
            <EditNodeModal
              isEditOpen
              onEditOpenChange={onEditOpenChange}
              node={selectedNode}
              handleEdit={handleEditNode}
              handleDelete={() => handleDeleteNode(selectedNode.id)}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default DiagramUI;
