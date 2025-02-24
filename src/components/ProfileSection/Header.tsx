import React from "react";
import { GiFastBackwardButton } from "react-icons/gi";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../store/hooks/hooks";

const Header: React.FC<{ setActiveTab: (tab: string) => void; activeTab: string }> = ({ setActiveTab, activeTab }) => {
  const navigate = useNavigate();
  const { userName} = useAppSelector((state) => state.profile);
  return (
    <>
      <div className="flex justify-between m-5 ">
        <div className="">
          <h2 className="text-2xl font-medium">{userName}</h2>
        </div>
        <div className="flex gap-2 bg-zinc-950 rounded-3xl p-2">
          <button
            className="rounded-full p-1"
            onClick={() => navigate("/dashboard")}
          >
            <GiFastBackwardButton />
          </button>
          <button
            className={`rounded-full p-1 ${
              activeTab === "Dev"
                ? "bg-white text-black"
                : "bg-zinc-950 text-white"
            }`}
            onClick={() => setActiveTab("Dev")}
          >
            Dev
          </button>
          <button
            className={`rounded-full p-1 ${
              activeTab === "Email"
                ? "bg-white text-black"
                : "bg-zinc-950 text-white"
            }`}
            onClick={() => setActiveTab("Email")}
          >
            Email
          </button>
          <button
            className={`rounded-full p-1 ${
              activeTab === "Security"
                ? "bg-white text-black"
                : "bg-zinc-900 text-white"
            }`}
            onClick={() => setActiveTab("Security")}
          >
            Security
          </button>
        </div>
      </div>
    </>
  );
};

export default Header;
