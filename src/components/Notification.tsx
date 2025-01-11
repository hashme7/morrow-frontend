import React from "react";
import { CheckCircle } from "react-feather";

interface NotificationProps {
  message: string;
  visible: boolean;
}

const Notification: React.FC<NotificationProps> = ({ message, visible }) => {
  if (!visible) return null;
  return (
    <div
      className="fixed top-10 right-4 bg-zinc-900 border border-gray-800 rounded-lg p-4 shadow-lg"
      role="alert"
    >
      <div className="flex items-center">
        <CheckCircle className="text-green-400" size={24} />
        <span className="ml-2 text-lg font-bold text-white">
          Update Success
        </span>
      </div>
      <p className="ml-6 mt-2 text-gray-300">{message}</p>
    </div>
  );
};

export default Notification;
