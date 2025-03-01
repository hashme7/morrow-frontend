import toast from "react-hot-toast";

interface ToastOptions {
  message: string;
  type?: "success" | "error" | "info" | "warning";
  icon?: string;
}

export const showToast = ({
  message,
  type = "info",
  icon = "🔔",
}: ToastOptions) => {
  console.log(type);
  toast(message, {
    icon,
    style: {
      borderRadius: "10px",
      background: "#333",
      color: "#fff",
    },
  });
};
