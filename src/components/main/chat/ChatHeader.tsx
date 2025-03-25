import React, { memo, useMemo } from "react";
import { IChatHeaderProps } from "../../../types/Chat";

const ChatHeader: React.FC<IChatHeaderProps> = ({ name, members }) => {
  const memberCount = useMemo(() => members.length, [members]);

  return (
    <div className="p-6 border-b">
      <h1 className="text-2xl font-roboto font-bold">{name}</h1>
      <p className="text-sm">{memberCount} members</p>
    </div>
  );
};

export default memo(ChatHeader);
