import React from "react";
import { FaPlusCircle } from "react-icons/fa";
import EducationCard from "../Cards/EducationCard";

const Education: React.FC = () => {
  return (
    <div className="w-full rounded-large bg-zinc-800 p-1">
      <div className="flex justify-between">
        <h3 className="font-bold p-2">Education</h3>
        <span className="p-3">
          <FaPlusCircle />
        </span>
      </div>
      <EducationCard />
    </div>
  );
};

export default Education;
