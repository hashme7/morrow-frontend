import React from "react";
import { FaEdit } from "react-icons/fa";

const WorkHours: React.FC = () => {
  return (
    <>
      <div className="h-20 w-full bg-zinc-800 rounded-large m-1  p-2 relative ">
        <h3 className="font-bold">Hours per week</h3>
        <span className="absolute right-0 top-0 p-2">
          <span className="absolute right-0 top-0 p-2">
            <FaEdit />
          </span>
        </span>
        <h4 className="font-bold text-zinc-500">more than 30 hours/week</h4>
      </div>
    </>
  );
};

export default WorkHours;
