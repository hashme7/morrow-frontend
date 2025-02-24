import React from "react";
import { GiFastBackwardButton } from "react-icons/gi";

const Header: React.FC<{ setActiveTab: (tab: string) => void; activeTab: string }> = ({ setActiveTab, activeTab }) => {
  return (
    <>
      <div className="flex m-5 ">
        <div className="top-2 pb-1 ">
          <h2 className="text-2xl font-medium">Profile</h2>
        </div>
        <div className="flex md:flex-row gap-2 md:gap-4 items-center md:justify-end bg-zinc-950 p-3 rounded-full absolute top-2 right-1">
          <button className="rounded-full p-1">
            <GiFastBackwardButton />
          </button>
          <button
            className={`rounded-full p-1 ${
              activeTab === "Dev"
                ? "bg-white text-black"
                : "bg-zinc-900 text-white"
            }`}
            onClick={() => setActiveTab("Dev")}
          >
            Dev
          </button>
          <button
            className={`rounded-full p-1 ${
              activeTab === "Email"
                ? "bg-white text-black"
                : "bg-zinc-900 text-white"
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
