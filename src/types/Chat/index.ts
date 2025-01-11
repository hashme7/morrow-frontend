import { ObjectId } from "mongoose";
import { IUser } from "../member";

export interface IChatHeaderProps {
  name: string;
  members: IUser[];
}

export interface IMessage {
  _id?:ObjectId,
    senderId: string;
    receiverId: string; 
    content: string;
    status: "pending" | "delivered" | "seen";
    timestamp: Date;
    readBy: string[];
}

export interface IMessagesListProps {
  messages: Array<IMessage>;
}
