import React from "react";
import LanguageCard from "../Cards/LanguageCard";
import { FaPlusCircle } from "react-icons/fa";

const Language: React.FC = () => {
  return (
    <>
      <div className="w-full bg-zinc-800  rounded-large p-2">
        <div className="flex justify-between">
          <h3 className="font-bold mt-1">Languages</h3>
          <span className="p-3">
            <FaPlusCircle />
          </span>
        </div>
        <LanguageCard />
      </div>
    </>
  );
};

export default Language;
