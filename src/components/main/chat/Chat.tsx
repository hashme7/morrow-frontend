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
import { Spinner } from "@nextui-org/react";
// import extractIdFromToken from "../../../utils/decodeToken";
import { getTeamMembers } from "../../../store/slices/memberSlice";

const Chat: React.FC = () => {
  const { chats } = useAppSelector((state) => state.chats);
  const { selectProject } = useAppSelector((state) => state.project);
  const { members } = useAppSelector((state) => state.members);
  const dispatch = useAppDispatch();

  const [socket, setSocket] = useState<Socket | null>(null);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<HTMLDivElement | null>(null);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!selectProject?.teamId) return;

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

    newSocket.on("new_message", (msg) => {
      dispatch(setMessage(msg));
      dispatch(setSeenMsg(msg));
    });

    newSocket.on("message_status", (msg) => {
      console.log("Message seen:", msg);
      dispatch(setSeenMsg(msg));
    });

    return () => {
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

    setLoading(true);
    dispatch(
      getTeamMembers({ projectId: selectProject.id.toString(), page: 1 })
    );

    dispatch(getMessage({ receiverId: selectProject.teamId, page: 1 })).then(
      (response) => {
        if (getMessage.fulfilled.match(response)) {
          updateMessages();
        }
        setLoading(false);
      }
    );
  }, [selectProject, dispatch, updateMessages]);

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
    <div className="bg-zinc-950 sm:h-[550px] h-[500px] rounded-3xl mb-3 m-1 flex flex-col">
      <ChatHeader name={selectProject?.name || ""} members={members} />

      <div
        className={`flex-grow ${
          chats.length > 6 ? "overflow-auto" : "overflow-y-hidden"
        } p-4`}
        style={{ maxHeight: "calc(85vh - 100px)" }}
      >
        <MessagesList messages={chats} ref={chatRef} />
        {loading && <Spinner size="sm" />}
        <div ref={messagesEndRef} />
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
