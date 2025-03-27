import { useEffect, useState, useCallback, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { useAppDispatch } from "../../store/hooks/hooks";
import {
  getMessage,
  setMessage,
  clearChat,
} from "../../store/slices/ChatSlice";
import { getTeamMembers } from "../../store/slices/memberSlice";
import { IMessage } from "../../types/Chat";

const SOCKET_URL = "wss://morrow-backend.hashim-dev007.online";
const SOCKET_PATH = "/communicate/message-socket";

const useChatSocket = (selectProject: any, userId: string | null) => {
  const dispatch = useAppDispatch();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [typingUsers, setTypingUsers] = useState<{ [key: string]: boolean }>(
    {}
  );
  const prevProjectRef = useRef<string | null>(null);

  // Simplified updateMessages (no "seen" logic)
  const updateMessages = useCallback(() => {
    // No need for IntersectionObserver or seen status updates
  }, []);

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
    newSocket.on("typing", onTyping);

    newSocket.emit("joinRoom", selectProject.teamId, userId);

    // Fetch team members and messages
    dispatch(
      getTeamMembers({ projectId: selectProject.id.toString(), page: 1 })
    );
    dispatch(getMessage({ receiverId: selectProject.teamId, page: 1 }));

    // Clean up
    return () => {
      newSocket.off("connect", onConnect);
      newSocket.off("connect_error", onConnectError);
      newSocket.off("new_message", onNewMessage);
      newSocket.off("typing", onTyping);
      newSocket.disconnect();
      setSocket(null);
      setTypingUsers({});
    };
  }, [selectProject?.teamId, selectProject?.id, userId, dispatch]);

  return { socket, typingUsers, updateMessages };
};

export default useChatSocket;
