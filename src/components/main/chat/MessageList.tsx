import { forwardRef, useEffect, useRef, useState } from "react";
import { IMessagesListProps } from "../../../types/Chat";
import { Chip } from "@nextui-org/react";
import { CheckIcon } from "@heroicons/react/24/outline";
import { useAppSelector } from "../../../store/hooks/hooks";
import { RootState } from "../../../store/store";

const MessagesList = forwardRef<HTMLDivElement, IMessagesListProps>(
  ({ messages }) => {
    const { members } = useAppSelector((state: RootState) => state.members);
    const users = new Map();
    for (let member of members) {
      users.set(member._id.toString(), member.username);
    }

    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const messageContainerRef = useRef<HTMLDivElement | null>(null);
    const [isUserScrollingUp, setIsUserScrollingUp] = useState(false);

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

      return () => {
        container.removeEventListener("scroll", handleScroll);
      };
    }, []);

    useEffect(() => {
      if (!isUserScrollingUp && messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, [messages]);

    return (
      <div
        ref={messageContainerRef}
        className={`messageList space-y-4  min-h-[700px] overflow-y-auto max-h-[700px] p-4`}
      >
        {messages.length ? (
          messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.senderId == localStorage.getItem("userId")
                  ? "justify-end"
                  : "justify-start"
              } message`}
              data-message-id={message._id}
            >
              <Chip
                endContent={
                  message.senderId === localStorage.getItem("userId") && (
                    <span>
                      {message.readBy.length || message.status === "seen" ? (
                        <div className="flex">
                          <CheckIcon className="h-4 w-4 text-green-500" />
                          <CheckIcon className="h-4 w-4 text-green-500" />
                        </div>
                      ) : (
                        <div>
                          <CheckIcon className="h-4 w-4 text-gray-500" />
                        </div>
                      )}
                    </span>
                  )
                }
                style={{
                  padding: "8px 16px",
                  fontSize: "14px",
                  lineHeight: "20px",
                  height: "auto",
                }}
                variant="flat"
                color={
                  message.senderId == localStorage.getItem("userId")
                    ? "default"
                    : "secondary"
                }
                className="max-w-xs text-sm flex items-center gap-2"
              >
                <div className="flex flex-col">
                  <span className="font-medium">{message.content}</span>
                  <div className="text-xs text-gray-400 mt-1">
                    {message.senderId == localStorage.getItem("userId")
                      ? "You"
                      : users.get(message.senderId)}
                  </div>
                </div>
              </Chip>
            </div>
          ))
        ) : (
          <div className="relative h-screen w-full">
            <div className="absolute inset-0 bg-opacity-50 flex items-center justify-center "></div>
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

export default MessagesList;
