import React from "react";
import { useAppDispatch, useAppSelector } from "../../../store/hooks/hooks";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessagesList from "./MessageList";
import useChatSocket from "../../../services/chat-service/chat";
import { sendMessage } from "../../../store/slices/ChatSlice";
import { IUser } from "../../../types/member";

const Chat: React.FC = () => {
  const { chats } = useAppSelector((state) => state.chats);
  const { selectProject } = useAppSelector((state) => state.project);
  const { members } = useAppSelector((state) => state.members);
  const dispatch = useAppDispatch();
  const userId = localStorage.getItem("userId");

  const { socket, typingUsers,updateMessages } = useChatSocket(
    selectProject,
    userId
  );

  const handleSendMessage = (content: string) => {
    if (!socket || !selectProject?.teamId || !userId) return;
    const message = {
      senderId: userId,
      receiverId: selectProject.teamId,
      content,
    };
    dispatch(sendMessage(message));
  };

  return (
    <div className="bg-zinc-950 md:h-full h-[500px] rounded-3xl mb-3 m-1 flex flex-col">
      <ChatHeader name={selectProject?.name || ""} members={members} />

      <div
        className={`flex-grow p-4 ${
          chats.length > 6 ? "overflow-auto" : "overflow-hidden"
        } h-[70vh]`}
      >
        <MessagesList messages={chats} updateMessages={updateMessages} />
        <div />
      </div>
      <div className="px-4 text-sm text-gray-400">
        {Object.keys(typingUsers)
          .filter((id) => typingUsers[id] && id !== userId)
          .map((id, index, arr) => (
            <span key={id}>
              {members.find((member:IUser) => member._id.toString() === id)
                ?.username || "Someone"}{" "}
              {index === arr.length - 1 ? "is typing..." : ", "}
            </span>
          ))}
      </div>
      {socket && selectProject && (
        <MessageInput
          socket={socket}
          roomId={selectProject.teamId}
          handleSendMessage={handleSendMessage}
        />
      )}
    </div>
  );
};

export default Chat;
