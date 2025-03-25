import { forwardRef, useEffect, useRef, useState } from "react";
import { IMessagesListProps } from "../../../types/Chat";
import { Chip } from "@nextui-org/react";
import { useAppSelector } from "../../../store/hooks/hooks";
import { RootState } from "../../../store/store";

const MessagesList = forwardRef<HTMLDivElement, IMessagesListProps>(
  ({ messages, updateMessages }) => {
    const { members } = useAppSelector((state: RootState) => state.members);
    // Create users map once, using useMemo for performance
    const users = useRef(new Map());
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const messageContainerRef = useRef<HTMLDivElement | null>(null);
    const [isUserScrollingUp, setIsUserScrollingUp] = useState(false);
    const userId = localStorage.getItem("userId");

    // Update users map when members change
    useEffect(() => {
      const newUsersMap = new Map();
      for (const member of members) {
        console.log(member.username, "user", member._id.toString());
        newUsersMap.set(member._id.toString(), member.username);
      }
      users.current = newUsersMap;
    }, [members]);

    useEffect(() => {
      const container = messageContainerRef.current;
      if (!container) return;

      const handleScroll = () => {
        const isAtBottom =
          container.scrollHeight - container.scrollTop <=
          container.clientHeight + 10;
        setIsUserScrollingUp(!isAtBottom);
      };

      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }, []);

    // Scroll to bottom when messages change
    useEffect(() => {
      if (!isUserScrollingUp && messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
      updateMessages();
    }, [messages, isUserScrollingUp, updateMessages]);

    return (
      <div
        ref={messageContainerRef}
        className="messageList space-y-4 min-h-[700px] overflow-y-auto max-h-[700px] p-4 hide-scrollbar"
      >
        {messages.length ? (
          messages.map((message, index) => (
            <div
              key={message._id?.toString() || index}
              className={`flex ${
                message.senderId == userId ? "justify-end" : "justify-start"
              } message`}
              data-message-id={message._id}
              data-sender-id={message.senderId}
            >
              <Chip
                style={{
                  padding: "10px 16px",
                  fontSize: "14px",
                  lineHeight: "20px",
                  height: "auto",
                  borderRadius: "12px 12px 4px 12px", // Custom shape
                  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)", // Soft shadow
                  border: "1px solid rgba(255, 255, 255, 0.2)", // Light border
                }}
                variant="bordered"
                color={message.senderId == userId ? "default" : "secondary"}
                className={`max-w-xs text-sm flex items-center gap-2 
    px-4 py-2  text-white 
    ${
      message.senderId === userId
        ? "rounded-tr-2xl rounded-bl-md rounded-br-2xl"
        : "rounded-tl-2xl rounded-br-md rounded-bl-2xl"
    }`}
              >
                <div className="flex flex-col">
                  <span className="font-medium">{message.content}</span>
                  <div className="text-xs text-gray-400 mt-1">
                    {message.senderId == userId
                      ? "You"
                      : users.current.get(message.senderId) ||
                        `Unknown User ${message.senderId},userId`}
                  </div>
                </div>
              </Chip>
            </div>
          ))
        ) : (
          <div className="relative h-screen w-full">
            <div className="absolute inset-0 bg-opacity-50 flex items-center justify-center"></div>
            <div className="text-center text-pretty text-white">
              <p className="text-3xl font-bold mb-4">No messages</p>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
    );
  }
);

// Add display name for better debugging
MessagesList.displayName = "MessagesList";

export default MessagesList;
