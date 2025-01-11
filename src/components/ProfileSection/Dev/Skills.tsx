import React from "react";
import SkillCard from "../Cards/SkillCard";

const Skills: React.FC = () => {
  const skillsArray = ["JavaScript", "React", "Node.js", "CSS"];
  return (
    <>
      <div className="bg-zinc-800 m-1 rounded-large h-auto  ">
        <h3 className="font-bold p-2">Skills</h3>
        <div className="grid grid-cols-2 lg:grid-cols-3 p-2 gap-4">
          {skillsArray.map((skill,i) => {
            return <SkillCard key={i} skill={skill} />;
          })}
        </div>
      </div>
    </>
  );
}

export default Skills;
