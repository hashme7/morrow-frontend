import mongoose from "mongoose";
import { ButtonHTMLAttributes } from "react";

export interface CustomButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  auto?: boolean;
  radius?: "full";
  bordered?: boolean;
  borderWeight?: string;
}

export interface ConfirmActionProps {
  isOpen: boolean;
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  modalPlacement?: "center" | "top" | "bottom";
  onConfirm: () => void;
  onCancel: () => void;
  handleNoteChange:(e:React.ChangeEvent<HTMLInputElement>)=>void;
  note:string,
}

export interface IRequests{
  team_Id:mongoose.Types.ObjectId,
  user_Id:mongoose.Types.ObjectId,
}