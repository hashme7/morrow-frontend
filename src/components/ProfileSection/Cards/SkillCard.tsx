
import { Chip } from "@nextui-org/chip";
import React from "react";

const SkillCard: React.FC<{skill:string}> = ({skill}) => {
  return (
      <Chip onClose={() => console.log("close")}>{skill}</Chip>
  );
};

export default SkillCard;
