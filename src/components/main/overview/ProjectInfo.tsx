interface ProjectInfoProps {
    title: string;
    startDate: string;
    deadline: string;
    teamMembers: number;
    projectLeader: string;
  }

  import React from 'react'
// import { useAppSelector } from '../../../store/hooks/hooks';
  
  const ProjectInfo: React.FC<ProjectInfoProps> = ({ title, startDate, deadline, teamMembers, projectLeader }) => {
    return (
      <div className="bg-zinc-900 text-white p-4 rounded-lg shadow-lg h-fit">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="mt-2">Start Date: {startDate}</p>
        <p>Deadline: {deadline}</p>
        <p>Team Members: {teamMembers}</p>
        <p>Project Leader: {projectLeader}</p>
      </div>
    );
  };
  


  export default ProjectInfo;