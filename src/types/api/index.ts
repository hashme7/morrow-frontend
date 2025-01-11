import mongoose from "mongoose";

export interface IApi {
  _id?: mongoose.Types.ObjectId;
  projectId: number;
  url: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" | "HEAD";
  body: any;
}