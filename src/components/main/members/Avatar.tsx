import { Avatar as Av } from "@nextui-org/avatar";
import React from "react";

const Avatar: React.FC<{ src: string; name: string  | null}> = ({ src, name }) => {
  return (
    <div className="flex-col justify-center m-2 mt-2">
      <Av isBordered color="default" src={src} />
      <p className="font-medium text-zinc-700">{name}</p>
    </div>
  );
};

export default Avatar;
