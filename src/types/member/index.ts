import mongoose from "mongoose";

export interface IUser {
  _id: mongoose.Types.ObjectId;
  image: string;
  username: string;
  password: string;
  email: string;
  phone?: number | null;
  fullName?: string | null;
  basedIn?: string | null;
  isProjectManager?: boolean;
  registrationTime?: Date;
  isVerified?: boolean;
  role?: "Developer" | "TeamLead" | "ProjectManager";
  createdAt?: Date;
  updatedAt?: Date;
}

export type MergeOption = "Developer" | "ProjectManager" | "TeamLead";

export interface IRole{
  team_id: mongoose.Types.ObjectId,
  userId: mongoose.Types.ObjectId,
  role:"Developer" | "TeamLead" | "ProjectManager",
}
export interface IUpdateResponse{
  data: IRole,
  status: number,
  message?:string
}
