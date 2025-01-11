import mongoose from "mongoose";
import { CSSProperties } from "react";

export interface Viewport {
  x: number;
  y: number;
  zoom: number;
}
export interface NodeData {
  collectionName?: string;
  fields?: any[];
  data?: any;
}
export interface Node {
  data: NodeData;
  dragging: boolean;
  id: string;
  measured?: { width?: number; height?: number };
  position: { x: number; y: number };
  selected?: boolean;
  type?: string;
}
export interface Edges {
  animated?: boolean;
  id: string;
  source: string;
  sourceHandle?: string |null;
  style?: CSSProperties;
  target?: string |null;
  targetHandle?: string | null;
}
export interface IDbDesign {
  _id?: mongoose.Types.ObjectId;
  projectId: number;
  nodes: any[];
  edges: any[];
  viewport: Viewport;
}
interface Field {
  data: string;
  type: string;
}
export interface tableState extends Record<string, unknown> {
  collectionName: string;
  fields: Field[];
}
