import React, { useState, useEffect, useRef, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/hooks/hooks";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessagesList from "./MessageList";
import { io, Socket } from "socket.io-client";
import {
  getMessage,
  sendMessage,
  setMessage,
  setSeenMsg,
} from "../../../store/slices/ChatSlice";
import { getTeamMembers } from "../../../store/slices/memberSlice";

const Chat: React.FC = () => {
  const { chats } = useAppSelector((state) => state.chats);
  const { selectProject } = useAppSelector((state) => state.project);
  const { members } = useAppSelector((state) => state.members);
  const [typingUsers, setTypingUsers] = useState<{ [key: string]: boolean }>(
    {}
  );
  const dispatch = useAppDispatch();

  const [socket, setSocket] = useState<Socket | null>(null);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<HTMLDivElement | null>(null);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!selectProject?.teamId) return;
    console.log(loading);

    const newSocket = io("wss://morrow.hashim-dev007.online", {
      path: "/communicate/message-socket",
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });

    setSocket(newSocket);

    newSocket.on("connect", () => console.log("Connected to server"));
    newSocket.on("connect_error", (err) => console.error("Socket Error:", err));
    newSocket.emit("joinRoom", selectProject.teamId, userId);

    newSocket.on("new_message", (msg) => {
      dispatch(setMessage(msg));
      dispatch(setSeenMsg(msg));
    });

    newSocket.on("message_status", (msg) => {
      console.log("Message seen:", msg);
      dispatch(setSeenMsg(msg));
    });
    newSocket.on("typing", ({ userId, isTyping }) => {
      console.log("typing... from ", userId, isTyping);
      setTypingUsers((prev) => ({
        ...prev,
        [userId]: isTyping,
      }));
      
    });

    return () => {
      newSocket.off("typing");
      newSocket.disconnect();
      setSocket(null);
    };
  }, [selectProject]);

  const updateMessages = useCallback(() => {
    if (!socket || !selectProject?.teamId) return;

    const unseenMessages = chats.filter(
      (msg) => msg.senderId !== userId && msg.status !== "seen"
    );

    unseenMessages.forEach((msg) => {
      socket.emit("message_seen", {
        roomId: selectProject.teamId,
        messageId: msg._id,
        userId,
      });
    });
  }, [chats, selectProject, socket, userId]);
  useEffect(() => {
    if (!selectProject) return;
    dispatch(
      getTeamMembers({ projectId: selectProject.id.toString(), page: 1 })
    );
  }, [selectProject]);

  useEffect(() => {
    if (!selectProject) return;

    setLoading(true);
    
    dispatch(getMessage({ receiverId: selectProject.teamId, page: 1 })).then(
      (response) => {
        if (getMessage.fulfilled.match(response)) {
          updateMessages();
        }
        setLoading(false);
      }
    );
  }, [selectProject]);

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
        className={` flex-grow  p-4 ${
          chats.length > 6 ? "overflow-auto" : "overflow-hidden"
        } h-[70vh]
`}
        ref={chatRef}
        // style={{ maxHeight: "calc(85vh - 100px)" }}
      >
        <MessagesList messages={chats} ref={chatRef} />
        <div ref={messagesEndRef} />
      </div>

      <div className="px-4 text-sm text-gray-400">
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
      {socket && selectProject && (
        <>
          <MessageInput
            socket={socket}
            roomId={selectProject.teamId}
            handleSendMessage={handleSendMessage}
          />
        </>
      )}
    </div>
  );
};

export default Chat;
