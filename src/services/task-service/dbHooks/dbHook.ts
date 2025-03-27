import { useCallback, useEffect, useMemo, useState } from "react";
import {
  addEdge,
  Connection,
  Edge,
  Node,
  NodeTypes,
  OnInit,
  ReactFlowInstance,
  useEdgesState,
  useNodesState,
} from "@xyflow/react";
import { useDisclosure } from "@nextui-org/react";
import { useAppDispatch, useAppSelector } from "../../../store/hooks/hooks";
import { RootState } from "../../../store/store";
import {
  clearDb,
  getDiagram,
  saveDiagram,
} from "../../../store/slices/diagramSlice";
import { tableState } from "../../../types/diagram";
import DbCollectionNode from "../../../components/main/diagram/tableNode";
import debounce from "../../../utils/debounce";

export type customNode = Node<{ data: tableState }>;
export const initialNodes: customNode[] = [];
export const initialEdges: Edge[] = [];

export const useDiagramLogic = () => {
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

  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onOpenChange: onEditOpenChange,
  } = useDisclosure();

  const debouncedSave = useMemo(
    () =>
      debounce(() => {
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
        }
      }, 300),
    [instanceofRC, selectProject?.id, dispatch]
  );

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
      setEdges((oldEdges) => addEdge(connection, oldEdges));
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
    return () => {
      dispatch(clearDb());
    };
  }, [selectProject, dispatch]);

  useEffect(() => {
    setNodes(diagram.nodes || []);
    setEdges(diagram.edges || []);
  }, [diagram.nodes, diagram.edges]);

  return {
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
  };
};
