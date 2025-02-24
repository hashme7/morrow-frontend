import { Progress } from "@nextui-org/react";
import React from "react";
interface ProgressBarProps {
  completed: number;
  hold: number;
  progress: number;
  pending: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  completed,
  hold,
  progress,
  pending,
}) => {
  return (
    <div className=" text-white rounded-lg shadow-lg">
      <div className="bg-zinc-950 p-3 rounded-2xl">
        <h2 className="text-xl font-semibold mb-1">Overall Progress</h2>
        <Progress color="success" value={completed} />
      </div>
      <div className="grid grid-cols-2">
        <div className="bg-zinc-950 p-3 m-1 rounded-2xl">
          <p className="font-semibold mb-1">On hold</p>
          <Progress color="warning" value={hold} />
        </div>
        <div className="m-1 bg-zinc-950 p-3 rounded-2xl">
          <p className="font-semibold mb-1">progress</p>
          <Progress color="secondary" value={progress} />
        </div>
        <div className="m-1 bg-zinc-950 p-3 rounded-2xl">
          <p className="font-semibold mb-1">pending</p>
          <Progress color="danger" value={pending} />
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
