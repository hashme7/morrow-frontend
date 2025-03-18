import { useEffect, useState, useCallback, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { useAppDispatch, useAppSelector } from "../../store/hooks/hooks";
import {
  getMessage,
  setMessage,
  setSeenMsg,
  clearChat,
} from "../../store/slices/ChatSlice";
import { getTeamMembers } from "../../store/slices/memberSlice";
// import { RootState } from "../../store/store";
import { IMessage } from "../../types/Chat";
import { RootState } from "../../store/store";

const SOCKET_URL = "wss://morrow-backend.hashim-dev007.online";
const SOCKET_PATH = "/communicate/message-socket";

const useChatSocket = (selectProject: any, userId: string | null) => {
  const dispatch = useAppDispatch();
  const { chats } = useAppSelector((state: RootState) => state.chats);
  const [socket, setSocket] = useState<Socket | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const processedMessagesRef = useRef<Set<string>>(new Set());
  const [typingUsers, setTypingUsers] = useState<{ [key: string]: boolean }>(
    {}
  );
  const prevProjectRef = useRef<string | null>(null);

  const updateMessages = useCallback(() => {
    if (!socket || !selectProject || !userId) return;
    if (observerRef.current) {
      observerRef.current.disconnect();
    }
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const messageElement = entry.target;
            const messageId = messageElement.getAttribute("data-message-id");
            const senderIdAttr = messageElement.getAttribute("data-sender-id");
            const message = chats.find(
              (msg: IMessage) => msg._id?.toString() == messageId
            );
            if (
              message &&
              senderIdAttr &&
              senderIdAttr !== userId &&
              message.status !== "seen" && (!message.readBy || !message.readBy.includes(userId))
            ) {
              console.log("message_seeninggg.........")
              socket.emit("message_seen", {
                messageId,
                roomId: selectProject.teamId,
                userId,
              });
              observerRef.current?.unobserve(messageElement);
            }
          }
        });
      },
      {
        root: document.querySelector(".messageList"),
        rootMargin: "0px",
        threshold: 0.6,
      }
    );
    setTimeout(() => {
      const messageElements = document.querySelectorAll(".message");
      messageElements.forEach((messageEl) => {
        const senderIdAttr = messageEl.getAttribute("data-sender-id");
        // Only observe messages from other users
        if (senderIdAttr && senderIdAttr !== userId) {
          observerRef.current?.observe(messageEl);
        }
      });
    }, 300);
    return () => {
      observerRef.current?.disconnect();
    };
  }, [socket, selectProject, userId]);

  // Handle socket connection and message events
  useEffect(() => {
    // Clean up previous connection when project changes
    if (
      prevProjectRef.current &&
      prevProjectRef.current !== selectProject?.teamId
    ) {
      dispatch(clearChat());
    }

    if (!selectProject?.teamId || !userId) return;
    prevProjectRef.current = selectProject.teamId;

    // Create socket connection
    const newSocket = io(SOCKET_URL, {
      path: SOCKET_PATH,
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });

    setSocket(newSocket);

    // Socket event listeners
    const onConnect = () => console.log("Connected to chat server");
    const onConnectError = (err: Error) => console.error("Socket Error:", err);

    const onNewMessage = (msg: IMessage) => {
      dispatch(setMessage(msg));
    };

    const onMessageStatus = (msg: IMessage) => {
      dispatch(setSeenMsg(msg));
      if (msg.status === "seen" && msg.readBy && msg.readBy.includes(userId) && msg._id) {
        console.log("msg......")
        processedMessagesRef.current.add(msg._id.toString());
      }
    };

    const onTyping = ({
      userId: typingUserId,
      isTyping,
    }: {
      userId: string;
      isTyping: boolean;
    }) => {
      setTypingUsers((prev) => ({
        ...prev,
        [typingUserId]: isTyping,
      }));
    };

    newSocket.on("connect", onConnect);
    newSocket.on("connect_error", onConnectError);
    newSocket.on("new_message", onNewMessage);
    newSocket.on("message_status", onMessageStatus);
    newSocket.on("typing", onTyping);

    newSocket.emit("joinRoom", selectProject.teamId, userId);

    dispatch(
      getTeamMembers({
        projectId: selectProject.id.toString(),
        page: 1,
      })
    );

    dispatch(
      getMessage({
        receiverId: selectProject.teamId,
        page: 1,
      })
    ).then((response: any) => {
      if (getMessage.fulfilled.match(response)) {
        updateMessages();
      }
    });
    
    // Clean up
    return () => {
      newSocket.off("connect", onConnect);
      newSocket.off("connect_error", onConnectError);
      newSocket.off("new_message", onNewMessage);
      newSocket.off("message_status", onMessageStatus);
      newSocket.off("typing", onTyping);
      newSocket.disconnect();
      setSocket(null);
      setTypingUsers({});
    };
    
  }, [selectProject?.teamId, selectProject?.id, userId]);

  return { socket, typingUsers, updateMessages };
};

export default useChatSocket;
