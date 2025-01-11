import React, { useState } from "react";

const MessageInput: React.FC<{
  handleSendMessage: (content: string) => void;
}> = ({ handleSendMessage }) => {
  const [message, setMessage] = useState("");

  return (
    <div className="p-4 flex items-center gap-3 rounded-b-xl">
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
        className="flex-grow  text-white px-4 py-2 rounded-full outline-none placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
      />
      <button
        onClick={() => {
          setMessage("");
          handleSendMessage(message);
        }}
        className="bg-zinc-950 text-white px-5 py-2.5 rounded-full font-medium hover:bg-white hover:text-black transition duration-200 ease-in-out"
      >
        Send
      </button>
    </div>
  );
};

export default MessageInput;
