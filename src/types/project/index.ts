import { DateValue } from "@nextui-org/react";
export interface projectInputs {
  name: string;
  plannedStartDate: DateValue | null;
  plannedEndDate: DateValue | null;
  description: string;
}

export interface IProject {
  id: number;
  name: string;
  projectStartDate: string | null;
  projectEndDate: string | null;
  plannedStartDate: Date;
  plannedEndDate: Date;
  projectDescription: string | null;
  teamId: string;
  createdAt?: string;
  updatedAt?: string;
  selected:boolean,
}

export interface IProjectResponse {
  data: IProject[];
  message: string;
}
