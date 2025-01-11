import React from "react";
import { useAppSelector } from "../../../store/hooks/hooks";

const Meet: React.FC = () => {
  const { selectProject } = useAppSelector((state) => state.project);

  const handleCreateMeeting = () => {
    if (selectProject?.id) {
      const roomID = selectProject.id.toString();
      const url = `/meet-room?roomID=${roomID}`;
      window.open(url, "_blank");
    }
  };

  return (
    <div className="flex items-center justify-center w-full h-screen bg-black text-white">
      <div className="text-center">
        
          <div>
            <h1 className="text-3xl text-white mb-6">
              Connect with your team and collaborators seamlessly with our
              real-time video meetings.
            </h1>
            <button
              onClick={handleCreateMeeting}
              className="bg-white text-black text-lg px-6 py-3 rounded-full hover:bg-blue-600 transition duration-200 ease-in-out"
            >
              Create or join Meeting
            </button>
          </div>
      </div>
    </div>
  );
};

export default Meet;
