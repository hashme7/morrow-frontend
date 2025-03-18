import React, { useEffect, useState, useCallback, useRef } from "react";
import { Socket } from "socket.io-client";
import extractIdFromToken from "../../../utils/decodeToken";
import { debounce } from "lodash";

interface MessageInputProps {
  handleSendMessage: (content: string) => void;
  socket: Socket;
  roomId: string;
}

const MessageInput: React.FC<MessageInputProps> = ({
  handleSendMessage,
  socket,
  roomId,
}) => {
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const userId = useRef(extractIdFromToken());

  // Debounce the typing event emissions to prevent flooding the server
  const emitStoppedTyping = useCallback(
    debounce(() => {
      if (socket.connected) {
        socket.emit("userStoppedTyping", { userId: userId.current, roomId });
        setIsTyping(false);
      }
    }, 1000),
    [socket, roomId]
  );

  // Handle typing status
  useEffect(() => {
    if (!socket.connected) return;

    if (message.length > 0 && !isTyping) {
      socket.emit("userTyping", { userId: userId.current, roomId });
      setIsTyping(true);
    } else if (message.length === 0 && isTyping) {
      socket.emit("userStoppedTyping", { userId: userId.current, roomId });
      setIsTyping(false);
    } else if (message.length > 0) {
      // Reset the debounce timer when user is still typing
      emitStoppedTyping();
    }

    return () => {
      emitStoppedTyping.cancel();
    };
  }, [message, isTyping, socket, roomId, emitStoppedTyping]);

  const handleSubmit = useCallback(() => {
    if (!message.trim()) return;

    handleSendMessage(message);
    setMessage("");

    if (isTyping) {
      socket.emit("userStoppedTyping", { userId: userId.current, roomId });
      setIsTyping(false);
    }
  }, [message, handleSendMessage, socket, roomId, isTyping]);

  return (
    <div className="p-4 flex items-center gap-3 rounded-b-xl w-full">
      <input
        type="text"
        placeholder="Type a message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
          }
        }}
        className="flex-grow text-white px-4 py-2 rounded-full outline-none placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
      />
      <button
        onClick={handleSubmit}
        disabled={!message.trim()}
        className={`bg-zinc-950 text-white rounded-full font-medium px-4 py-2 
          ${
            message.trim()
              ? "hover:bg-white hover:text-black"
              : "opacity-50 cursor-not-allowed"
          }
          transition duration-200 ease-in-out`}
      >
        Send
      </button>
    </div>
  );
};

export default React.memo(MessageInput);
