import React, { useCallback, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/hooks/hooks";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessagesList from "./MessageList";
import useChatSocket from "../../../services/chat-service/chat";
import { sendMessage } from "../../../store/slices/ChatSlice";

const Chat: React.FC = () => {
  const { chats } = useAppSelector((state) => state.chats);
  const { selectProject } = useAppSelector((state) => state.project);
  const { members } = useAppSelector((state) => state.members);
  const dispatch = useAppDispatch();
  const userId = localStorage.getItem("userId");
  const teamId = useMemo(() => selectProject?.teamId, [selectProject?.teamId]);

  const { socket, typingUsers, updateMessages } = useChatSocket(
    selectProject,
    userId
  );

  const handleSendMessage = useCallback(
    (content: string) => {
      if (!socket || !teamId || !userId || !content.trim()) return;

      const message = {
        senderId: userId,
        receiverId: teamId,
        content: content.trim(),
      };

      dispatch(sendMessage(message));
    },
    [socket, teamId, userId, dispatch]
  );

  if (!selectProject) {
    return (
      <div className="bg-zinc-950 md:h-full h-[500px] rounded-3xl mb-3 m-1 flex items-center justify-center">
        <p className="text-white text-lg">Select a project to start chatting</p>
      </div>
    );
  }

  return (
    <div className="bg-zinc-950 md:h-full h-[500px] rounded-3xl mb-3 m-1 flex flex-col">
      <ChatHeader name={selectProject?.name || ""} members={members} />
      <div className="flex-grow p-4 overflow-hidden h-[70vh]">
        <MessagesList messages={chats} updateMessages={updateMessages} />
      </div>
      <div className="px-4 text-sm text-gray-400 h-6">
        {Object.keys(typingUsers)
          .filter((id) => typingUsers[id] && id !== userId)
          .map((id, index, arr) => (
            <span key={id}>
              {members.find((member) => member._id.toString() === id)
                ?.username || "Someone"}{" "}
              {index === arr.length - 1 ? "is typing..." : ", "}
            </span>
          ))}
      </div>
      {socket && teamId && (
        <MessageInput
          socket={socket}
          roomId={teamId}
          handleSendMessage={handleSendMessage}
        />
      )}
    </div>
  );
};

export default React.memo(Chat);
