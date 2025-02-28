import { forwardRef, useEffect, useRef, useMemo } from "react";
import { IMessagesListProps } from "../../../types/Chat";
import { Chip } from "@nextui-org/react";
import { CheckIcon } from "@heroicons/react/24/outline";
import { useAppSelector } from "../../../store/hooks/hooks";
import { RootState } from "../../../store/store";

const MessagesList = forwardRef<HTMLDivElement, IMessagesListProps>(
  ({ messages }, ref) => {
    const { members } = useAppSelector((state: RootState) => state.members);
    const userId = localStorage.getItem("userId");
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    const usersMap = useMemo(() => {
      const map = new Map();
      members.forEach((member) =>
        map.set(member._id.toString(), member.username)
      );
      return map;
    }, [members]);

    useEffect(() => {
      if (messagesEndRef.current && messages.length > 6) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, [messages]);

    return (
      <div className="messageList space-y-4 min-h-[700px]" ref={ref}>
        {messages.length ? (
          messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.senderId === userId ? "justify-end" : "justify-start"
              }`}
            >
              <Chip
                endContent={
                  message.senderId === userId && (
                    <span>
                      {message.readBy.length || message.status === "seen" ? (
                        <div className="flex">
                          <CheckIcon className="h-4 w-4 text-green-500" />
                          <CheckIcon className="h-4 w-4 text-green-500" />
                        </div>
                      ) : (
                        <CheckIcon className="h-4 w-4 text-gray-500" />
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
                color={message.senderId === userId ? "default" : "secondary"}
                className="max-w-xs text-sm flex items-center gap-2"
              >
                <div className="flex flex-col">
                  <span className="font-medium">{message.content}</span>
                  <div className="text-xs text-gray-400 mt-1">
                    {message.senderId === userId
                      ? "You"
                      : usersMap.get(message.senderId)}
                  </div>
                </div>
              </Chip>
            </div>
          ))
        ) : (
          <div className="text-center text-white text-3xl font-bold mt-10">
            No messages
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
    );
  }
);

export default MessagesList;
