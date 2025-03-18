// src/hooks/useChatSocket.ts
import { useEffect, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { useAppDispatch, useAppSelector } from "../../store/hooks/hooks";
import {
  getMessage,
  setMessage,
  setSeenMsg,
} from "../../store/slices/ChatSlice";
import { getTeamMembers } from "../../store/slices/memberSlice";
import { RootState } from "../../store/store";

const useChatSocket = (
  selectProject: any,
  userId: string | null
) => {
  const dispatch = useAppDispatch();
  const { chats } = useAppSelector((state: RootState) => state.chats);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [typingUsers, setTypingUsers] = useState<{ [key: string]: boolean }>(
    {}
  );

  const updateMessages = useCallback(() => {
    if (!socket || !selectProject?.teamId) return;
    const unseenMessages = chats.filter(
      (msg: any) => {
        if (msg.senderId != userId && msg.status !== "seen" && msg.status !== "pending") {
          console.log(msg, msg.senderId == userId);
          return msg;
        }
      } 
    );
    if (!unseenMessages.length) return;
    console.log("unseened Messages>..", userId, unseenMessages);
    unseenMessages.forEach((msg: any) => {
      socket.emit("message_seen", {
        roomId: selectProject.teamId,
        messageId: msg._id,
        userId,
      });
    });
  }, [chats, socket, selectProject?.teamId, userId]);

  // const handleScroll = debounce(() => {
  //   const bottom =
  //     messagesEndRef.current &&
  //     messagesEndRef.current.getBoundingClientRect().bottom <=
  //       window.innerHeight;

  //   if (bottom) {
  //     console.log("ON SCROLL EVENT:-", bottom);
  //     updateMessages();
  //   }
  // }, 700)

  useEffect(() => {
    if (!selectProject?.teamId || !userId) return;

    const newSocket = io("wss://morrow-backend.hashim-dev007.online", {
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
      console.log(msg);
      dispatch(setSeenMsg(msg));
    });

    newSocket.on("typing", ({ userId, isTyping }) => {
      setTypingUsers((prev) => ({
        ...prev,
        [userId]: isTyping,
      }));
    });

    dispatch(
      getTeamMembers({ projectId: selectProject.id.toString(), page: 1 })
    );

    dispatch(getMessage({ receiverId: selectProject.teamId, page: 1 })).then(
      (response: any) => {
        if (getMessage.fulfilled.match(response)) {
          updateMessages();
        }
      }
    );

    return () => {
      newSocket.off("typing");
      newSocket.disconnect();
      setSocket(null);
    };
  }, [selectProject]);
  

  return { socket, typingUsers,updateMessages };
};

export default useChatSocket;
