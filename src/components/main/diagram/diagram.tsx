import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  addEdge,
  Background,
  BackgroundVariant,
  Connection,
  Controls,
  Edge,
  MiniMap,
  Node,
  NodeTypes,
  OnInit,
  ReactFlow,
  ReactFlowInstance,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Button, useDisclosure } from "@nextui-org/react";
import { useAppDispatch, useAppSelector } from "../../../store/hooks/hooks";
import { RootState } from "../../../store/store";
import { getDiagram, saveDiagram } from "../../../store/slices/diagramSlice";
import TableModal from "./tableModal";
import { tableState } from "../../../types/diagram";
import DbCollectionNode from "./tableNode";
import debounce from "../../../utils/debounce";
import EditNodeModal from "./editNodeModal";

type customNode = Node<{ data: tableState }>;
export const initialNodes: customNode[] = [];
export const initialEdges: Edge[] = [];

const Diagram: React.FC = () => {
  const [instanceofRC, setInstanceofRC] = useState<ReactFlowInstance<
    customNode,
    Edge
  > | null>(null);
  const { selectProject } = useAppSelector((state: RootState) => state.project);
  const diagram = useAppSelector((state: RootState) => state.diagram);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [nodes, setNodes, onNodesChange] =
    useNodesState<customNode>(initialNodes);
  const [selectedNode, setSelectedNode] = useState<customNode | null>(null);

  const dispatch = useAppDispatch();

  const debouncedSave = useMemo(
    () =>
      debounce(() => {
        console.log(instanceofRC, "instance");
        if (instanceofRC && selectProject?.id) {
          const flow = instanceofRC.toObject();
          const convertedNodes = flow.nodes.map((node) => ({
            ...node,
            dragging: node.dragging ?? false,
          }));
          const data = {
            projectId: selectProject.id,
            nodes: convertedNodes,
            edges: flow.edges,
            viewport: flow.viewport,
          };
          dispatch(saveDiagram(data));
        } else {
          console.log("afksjdkf");
        }
      }, 300),
    [instanceofRC, selectProject?.id, dispatch]
  );

  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onOpenChange: onEditOpenChange,
  } = useDisclosure();

  const handleAddTable = (table: tableState) => {
    const location = Math.random() * 800;
    const newNode = {
      id: crypto.randomUUID(),
      position: { x: location, y: location },
      type: "dbCollection",
      data: { data: table },
    };
    setNodes((prevNodes) => [...prevNodes, newNode]);
    onClose();
    debouncedSave();
  };

  const handleEditNode = (updatedNode: customNode) => {
    const updatedNodes = nodes.map((node) => {
      if (node.id === updatedNode.id) {
        return {
          ...node,
          data: {
            ...node.data,
            data: {
              ...node.data.data,
              collectionName: updatedNode.data.data.collectionName,
              fields: updatedNode.data.data.fields,
            },
          },
        };
      }
      return node;
    });
    setNodes(updatedNodes);
    debouncedSave();
  };

  const handleDeleteNode = (nodeId: string) => {
    setNodes((prevNodes) => prevNodes.filter((node) => node.id !== nodeId));
    setEdges((prevEdges) =>
      prevEdges.filter(
        (edge) => edge.source !== nodeId && edge.target !== nodeId
      )
    );
    debouncedSave();
  };

  const handleInit: OnInit<customNode, Edge> = (reactFlowInstance) => {
    setInstanceofRC(reactFlowInstance);
  };

  const nodeTypes: NodeTypes = useMemo(
    () => ({ dbCollection: DbCollectionNode }),
    []
  );

  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((oldEdges) => {
        const updatedEdges = addEdge(connection, oldEdges);
        return updatedEdges;
      });

      debouncedSave();
    },
    [setEdges, debouncedSave]
  );
  const handleDeleteEdge = (edgeId: string) => {
    setEdges((prevEdges) => prevEdges.filter((edge) => edge.id !== edgeId));
    debouncedSave();
  };
  const onNodeClick = (event: React.MouseEvent, node: customNode) => {
    console.log(event);
    setSelectedNode(node);
    onEditOpen();
  };

  useEffect(() => {
    if (selectProject?.id) {
      dispatch(getDiagram(selectProject.id));
    } else {
      setNodes(initialNodes);
      setEdges(initialEdges);
    }
  }, [selectProject, dispatch]);

  useEffect(() => {
    setNodes(diagram.nodes || []);
    setEdges(diagram.edges || []);
  }, [diagram.nodes, diagram.edges]);

  return (
    <>
      <div className="w-fit bg-zinc-900 ml-4 mb-4 mr-4 rounded-2xl flex justify-center relative">
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
              } }
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

export default Diagram;
