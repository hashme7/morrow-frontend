import React from "react";
import { FaFolder } from "react-icons/fa";

const WorkHistory: React.FC = () => {
  return (
    <>
      <div className="bg-zinc-800 m-1 h-auto rounded-large p-2">
        <h3 className="p-1 text-large font-bold">Work History</h3>
        <img
          src="https://via.placeholder.com/150"
          alt="files"
          className="w-full h-32 object-cover mb-2 rounded-large"
        />
        <p className="relative bottom-0 text-small">no history</p>

        <div className="w-full flex-row ">
          <div className="flex p-1 relative justify-start gap-2 hover:cursor-pointer">
            <span>
              <FaFolder />
            </span>
            <p className="text-small text-zinc-500">project Name</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default WorkHistory;
