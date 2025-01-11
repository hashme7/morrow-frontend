import React from "react";

const EducationCard: React.FC = () => {
  return (
    <>
      <div className="flex flex-row gap-2 justify-between p-1 rounded-large bg-black/20">
        <div className="basis-1/2">Higher Secondary School-India</div>
        <div className="basis-1/4 flex justify-evenly">
          <span className="p-1">edit</span>
          <span className="p-1">delete</span>
        </div>
      </div>
    </>
  );
};

export default EducationCard;
