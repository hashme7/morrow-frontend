import React, { useState, useEffect, useRef } from "react";
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
import extractIdFromToken from "../../../utils/decodeToken";
import { getTeamMembers } from "../../../store/slices/memberSlice";

const Chat: React.FC = () => {
  const {  chats } = useAppSelector((state) => state.chats);
  const { selectProject } = useAppSelector((state) => state.project);
  const { members } = useAppSelector((state) => state.members);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [loading, setLoading] = useState(false);
  // const [page, setPage] = useState(1);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<HTMLDivElement | null>(null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const newSocket = io("http://localhost:9000", {
      transports: ["websocket"],
    });
    setSocket(newSocket);
    if (selectProject?.id) {
      newSocket.emit("joinRoom", selectProject.teamId, extractIdFromToken());
    }
    if (newSocket) {
      newSocket.on("new_message", (msg) => {
        dispatch(setMessage(msg));
      });
      newSocket.on("message_status", (msg) => {
        dispatch(setSeenMsg(msg));
      });
    }
    return () => {
      newSocket.disconnect();
    };
  }, [selectProject]);

  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      try {
        if (selectProject) {
          dispatch(
            getTeamMembers({ projectId: selectProject.id.toString(), page: 1 })
          );
          dispatch(getMessage({ receiverId: selectProject.teamId, page:1 }));
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, [ selectProject?.id]);

 

  const handleSendMessage = (content: string) => {
    if (!socket || !selectProject?.teamId) return;
    const userId = localStorage.getItem("userId");
    if (userId) {
      const message = {
        senderId: userId,
        receiverId: selectProject?.teamId,
        content,
      };  
      dispatch(sendMessage(message));
    }
  };

  return (
    <div className="bg-zinc-900 h-full rounded-3xl m-2 flex flex-col">
      <div className="bg-zinc-800 h-fit rounded-xl">
        <ChatHeader name={selectProject?.name || ""} members={members} />
      </div>

      <div
        className="flex-grow overflow-y-auto p-4"
        style={{ maxHeight: "calc(85vh - 100px)" }}
      >
        <MessagesList messages={chats} ref={chatRef} />
        {loading && <Spinner size="sm" />}
        <div ref={messagesEndRef} />
      </div>

      <MessageInput handleSendMessage={handleSendMessage} />
    </div>
  );
};

export default Chat;
