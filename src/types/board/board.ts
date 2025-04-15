export type Id = string | number;
import React from 'react';
import { IUser } from '../member';
import mongoose, { Types } from 'mongoose';

export interface ITask {
  _id: Types.ObjectId;
  name: string;
  status: string;
  teamId: Types.ObjectId;
  createdAt: string;
  updatedAt: string;
  subTaskIds: string[];
  assignee: string[];
  priority: "Urgent" | "Low" | "Normal"|"High";
}

export type IColumn = {
  _id:Types.ObjectId,
  id: string;
  name: string;
  team_id:string,
  color:string,
}

export interface IBoardProps {
  initialData: IInitialData;
}

export interface IInitialData {
  tasks: Record<Id, ITask>;
  columns: Record<Id, IColumn>;
  columnOrder: Id[];
}

export interface IColumnProps {
  column: Omit<IColumn,"team_id">;
  addTask: (name: string, id: string, priority: string, status: string, addTask: { _id: mongoose.Types.ObjectId }[]) => void;
  taskIds: Id[],
  tasks:ITask[],
  handleColumnNameUpdate:(e:React.KeyboardEvent<HTMLDivElement>,name:string,id:string)=>void
  handleColumnDelete:(id:string)=>void,
  error: string
  members:IUser[],
  // onTaskAdd: (columnId: Id, taskContent: string) => void;
}

export interface getStatusResponse{
  status:number,
  data:IColumn[],
}

export interface ITaskProps {
  task: ITask;
}


export interface createStatusResponse{
  status:number,
  data:IColumn
}
export interface createStatusColumn{
  name:string,
  color:string,
  team_id:string,
  id:string
}

export interface updateStatusResponse{
  status:number;
  data:IColumn;
}
export interface deleteStatusResponse{
  status:number,
  data:string,
}
export type getTaskResponse = (Omit<ITask, "status"> & { status: { id: string } })[];