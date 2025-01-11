import React from "react";
import { IChatHeaderProps } from "../../../types/Chat";

const ChatHeader: React.FC<IChatHeaderProps> = ({ name, members }) => {
  console.log(members,"memebersss..")
  return (
    <>
      <div className="p-2">
        <h1 className="text-2xl font-roboto font-bold">{name}</h1>
        <p className="text-sm">{members.length} members</p>
      </div>
    </>
  );
};

export default ChatHeader;
