interface ProjectInfoProps {
  name: string;
  plannedStartDate: string;
  plannedEndDate: string;
  teamMembers: number;
  projectLeader: string;
  projectDescription: string;
}

import React from "react";
// import { useAppSelector } from '../../../store/hooks/hooks';

const ProjectInfo: React.FC<ProjectInfoProps> = ({
  name,
  plannedStartDate,
  plannedEndDate,
  teamMembers,
  projectLeader,
  projectDescription,
}) => {
  return (
    <div className="bg-zinc-950 text-white p-5 rounded-3xl shadow-lg h-fit ">
      <div className="flex-col flex gap-1">
        <h1 className="text-xl font-bold">{name}</h1>
        <h4 className="text-zinc-600 font-normal">{projectDescription}</h4>
      </div>
      <div className="grid gap-9 text-sm mt-5 grid-cols-2 lg:grid-cols-4">
        <div>
          <label htmlFor="startDate" className="text-zinc-500 text-xs">
            start Date
          </label>
          <p className="mt-1 startDate text-xs">{plannedStartDate}</p>
        </div>
        <div>
          <label htmlFor="deadline" className="text-zinc-500 text-xs">
            Dead Line
          </label>
          <p className="deadline mt-1 text-xs"> {plannedEndDate}</p>
        </div>
        <div>
          <label htmlFor="team" className="text-zinc-500 text-xs">
            Members
          </label>
          <p className="team mt-1 text-xs">{teamMembers}</p>
        </div>
        <div>
          <label htmlFor="report" className="text-zinc-500 text-xs">
            Reports
          </label>
          <p className="report mt-1 text-xs">1</p>
        </div>
      </div>

      <div>
        <label htmlFor="projectleader" className="text-zinc-500 text-xs">
          projectlea
        </label>
        <p className="projectleader">{projectLeader}</p>
      </div>
    </div>
  );
};

export default ProjectInfo;
