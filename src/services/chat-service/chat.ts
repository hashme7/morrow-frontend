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
import { RootState } from "../../store/store";
import { IMessage } from "../../types/Chat";

const SOCKET_URL = "wss://morrow-backend.hashim-dev007.online";
const SOCKET_PATH = "/communicate/message-socket";

const useChatSocket = (selectProject: any, userId: string | null) => {
  const dispatch = useAppDispatch();
  const { chats } = useAppSelector((state: RootState) => state.chats);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [typingUsers, setTypingUsers] = useState<{ [key: string]: boolean }>(
    {}
  );
  const prevProjectRef = useRef<string | null>(null);

  // Memoize updateMessages to prevent unnecessary re-renders
  const updateMessages = useCallback(() => {
    if (!socket || !selectProject?.teamId || !userId) return;

    const unseenMessages = chats.filter(
      (msg: IMessage) =>
        msg.senderId !== userId &&
        msg.status !== "seen" &&
        msg.status !== "pending"
    );

    if (!unseenMessages.length) return;

    unseenMessages.forEach((msg: IMessage) => {
      socket.emit("message_seen", {
        roomId: selectProject.teamId,
        messageId: msg._id,
        userId,
      });
    });
  }, [chats, socket, selectProject?.teamId, userId]);

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

      // Mark message as seen if from another user
      if (msg.senderId !== userId) {
        dispatch(setSeenMsg(msg));
        newSocket.emit("message_seen", {
          roomId: selectProject.teamId,
          messageId: msg._id,
          userId,
        });
      }
    };

    const onMessageStatus = (msg: IMessage) => {
      dispatch(setSeenMsg(msg));
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

    // Register event listeners
    newSocket.on("connect", onConnect);
    newSocket.on("connect_error", onConnectError);
    newSocket.on("new_message", onNewMessage);
    newSocket.on("message_status", onMessageStatus);
    newSocket.on("typing", onTyping);

    // Join room
    newSocket.emit("joinRoom", selectProject.teamId, userId);

    // Load team members and messages
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
  }, [
    selectProject?.teamId,
    selectProject?.id,
    userId,
  ]);

  return { socket, typingUsers, updateMessages };
};

export default useChatSocket;
