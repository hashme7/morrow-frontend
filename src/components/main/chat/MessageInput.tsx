import React, { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import extractIdFromToken from "../../../utils/decodeToken";
import { debounce } from "lodash";

const MessageInput: React.FC<{
  handleSendMessage: (content: string) => void;
  socket: Socket;
  roomId: string;
}> = ({ handleSendMessage, socket, roomId }) => {
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (message.length > 0 && !isTyping) {
      console.log("typing.....", extractIdFromToken(), roomId);
      socket.emit("userTyping", { userId: extractIdFromToken(), roomId });
      setIsTyping(true);
    }
    const stopTyping = debounce(() => {
      if (isTyping) {
        console.log("User stopped typing:", extractIdFromToken(), roomId);
        socket.emit("userStoppedTyping", {
          userId: extractIdFromToken(),
          roomId,
        });
        setIsTyping(false);
      }
    }, 1000);
    stopTyping();
    return () => {
      stopTyping.cancel();
    };
  }, [message]);

  return (
    <div className="p-4 flex items-center gap-3 rounded-b-xl w-full">
      <input
        type="text"
        placeholder="Type a message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key == "Enter") {
            setMessage("");
            handleSendMessage(message);
          }
        }}
        className="flex-grow text-white px-4 py-2 rounded-full outline-none placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
      />
      <button
        onClick={() => {
          setMessage("");
          handleSendMessage(message);
        }}
        className="bg-zinc-950 text-white  rounded-full font-medium hover:bg-white hover:text-black transition duration-200 ease-in-out"
      >
        Send
      </button>
    </div>
  );
};

export default MessageInput;
