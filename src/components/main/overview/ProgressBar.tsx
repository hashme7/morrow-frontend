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
    <div className=" bg-zinc-900 text-white  p-4 rounded-lg shadow-lg">
      <h4 className="text-lg font-semibold">Overall Progress</h4>
      <div className="m-2">
        <p>Completed Task</p>
        <Progress color="primary" value={completed} />
      </div>
      <div className="m-2">
        <p>On hold</p>
        <Progress color="warning" value={hold} />
      </div>
      <div className="m-2">
        <p>progress</p>
        <Progress color="secondary" value={progress} />
      </div>
      <div className="m-2">
        <p>pending</p>
        <Progress color="danger" value={pending} />
      </div>
    </div>
  );
};

export default ProgressBar;
