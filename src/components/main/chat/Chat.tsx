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
  const { chats } = useAppSelector((state) => state.chats);
  const { selectProject } = useAppSelector((state) => state.project);
  const { members } = useAppSelector((state) => state.members);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [loading, setLoading] = useState(false);
  // const [page, setPage] = useState(1);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<HTMLDivElement | null>(null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const newSocket = io("wss://morrow.hashim-dev007.online", {
      path: "/communicate/message-socket",
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });
    setSocket(newSocket);
    if (selectProject?.id) {
      newSocket.emit("joinRoom", selectProject.teamId, extractIdFromToken());
    }
    if (newSocket) {
      setSocket(newSocket);
      newSocket.on("connect", () => {
        console.log("Connected to server");
      });
      newSocket.on("connect_error", (err) => {
        console.error("Connection Error:", err.message);
        console.error("Error Details:", err);
      });
      newSocket.on("new_message", (msg) => {
        dispatch(setMessage(msg));
      });
      newSocket.on("message_status", (msg) => {
        console.log("message seen", msg);
        dispatch(setSeenMsg(msg));
      });
      
    }

    const fetchMessages = async () => {
      setLoading(true);
      try {
        if (selectProject) {
          dispatch(
            getTeamMembers({ projectId: selectProject.id.toString(), page: 1 })
          );
          const response =await dispatch(getMessage({ receiverId: selectProject.teamId, page: 1 }));
          if (getMessage.fulfilled.match(response)) {
            updateMessages();
          }
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
    const updateMessages = () => {
      console.log("on update messages",chats)
      const unseenMessages = chats.filter(
        (msg) => {
          console.log("msg",msg)
          if(msg.senderId !== localStorage.getItem("userId") &&
            msg.status !== "seen") {
            return msg;
          }
        }
          
      );

      console.log("unseednmengess",unseenMessages)

      unseenMessages.forEach((msg) => {
        console.log("updating the message seen..", msg);
        console.log(socket);
        newSocket.emit("message_seen", {
          messageId: msg._id,
          userId: localStorage.getItem("userId"),
        });
      });
    }
    return () => {
      newSocket.disconnect();
      setSocket(null);
    };
  }, [selectProject]);

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
    <div className="bg-zinc-950 sm:h-[650px] h-[500px]  rounded-3xl mb-3 m-1 flex flex-col">
      <div className="bg-zinc-950 rounded-xl">
        <ChatHeader name={selectProject?.name || ""} members={members} />
      </div>

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
