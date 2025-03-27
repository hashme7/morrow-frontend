import { forwardRef, useEffect, useRef } from "react";
import { IMessagesListProps } from "../../../types/Chat";
import { Chip } from "@nextui-org/react";
import { useAppSelector } from "../../../store/hooks/hooks";
import { RootState } from "../../../store/store";

const MessagesList = forwardRef<HTMLDivElement, IMessagesListProps>(
  ({ messages, updateMessages }) => {
    const { members } = useAppSelector((state: RootState) => state.members);
    const users = useRef(new Map());
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const messageContainerRef = useRef<HTMLDivElement | null>(null); 
    const userId = localStorage.getItem("userId");

    // Update users map when members change
    useEffect(() => {
      const newUsersMap = new Map();
      for (const member of members) {
        newUsersMap.set(member._id.toString(), member.username);
      }
      users.current = newUsersMap;
    }, [members]);

    // Scroll to bottom when messages change
    useEffect(() => {
      const container = messageContainerRef.current;
      if (container) {
        // Scroll to the bottom of the container
        container.scrollTop = container.scrollHeight;
      }
      updateMessages(); // Call this if still needed elsewhere
    }, [messages, updateMessages]);

    return (
      <div
        ref={messageContainerRef}
        className="messageList space-y-4 overflow-y-auto p-4 "
        style={{ maxHeight: "70vh", minHeight: "70vh" }} 
      >
        {messages.length ? (
          messages.map((message, index) => (
            <div
              key={message._id?.toString() || index}
              className={`flex ${
                message.senderId === userId ? "justify-end" : "justify-start"
              }`}
            >
              <Chip
                style={{
                  padding: "10px 16px",
                  fontSize: "14px",
                  lineHeight: "20px",
                  height: "auto",
                  borderRadius: "12px 12px 4px 12px",
                  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                }}
                variant="bordered"
                color={message.senderId === userId ? "default" : "secondary"}
                className={`max-w-xs text-sm flex items-center gap-2 
                px-4 py-2 text-white 
                ${
                  message.senderId === userId
                    ? "rounded-tr-2xl rounded-bl-md rounded-br-2xl"
                    : "rounded-tl-2xl rounded-br-md rounded-bl-2xl"
                }`}
              >
                <div className="flex flex-col">
                  <span className="font-medium">{message.content}</span>
                  <div className="text-xs text-gray-400 mt-1">
                    {message.senderId === userId
                      ? "You"
                      : users.current.get(message.senderId) || "Unknown User"}
                  </div>
                </div>
              </Chip>
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center h-full text-white">
            <p className="text-3xl font-bold">No messages</p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
    );
  }
);

MessagesList.displayName = "MessagesList";

export default MessagesList;
