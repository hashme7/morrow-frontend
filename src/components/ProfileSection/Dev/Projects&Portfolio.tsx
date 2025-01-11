import React from "react";
import { FaPlusCircle } from "react-icons/fa";

const ProjectNPortfolio: React.FC = () => {
  return (
    <>
      <div className="bg-zinc-800 row-span-2 m-1 h-auto p-2 rounded-large text-center">
        <div className="flex w-full justify-between">
          <h3 className="p-1 text-large font-bold">projects & portfolio </h3>
          <span className="relative top-2 right-0">
            <FaPlusCircle />
          </span>
        </div>
        <div>
          <img
            src="https://via.placeholder.com/150"
            alt="Project"
            className="w-full h-32 object-cover mb-2 rounded-large"
          />
          {/* <span className=""><FaBars className="w-20 h-20"></FaBars></span> */}
          <p className="relative bottom-0 text-small ">
            Add a project. Talent are hired 9x more often if they’ve published a
            portfolio.
          </p>
        </div>
      </div>
    </>
  );
};

export default ProjectNPortfolio;
