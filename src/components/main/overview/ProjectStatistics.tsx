
  
  interface ProjectStatisticsProps {
    projects: IProject[];
  }
  
import React from 'react';
import { IProject } from '../../../types/project';
  const ProjectStatistics: React.FC<ProjectStatisticsProps> = ({ projects }) => {
    return (
      <div className="bg-zinc-950 p-4 rounded-2xl h-64">
        <h3 className="text-lg font-semibold">Project Statistics</h3>
        <ul className="mt-4">
          {projects.map((project) => (
            <li
              key={project.id}
              className="flex justify-between text-sm text-gray-400 mt-2"
            >
              <span>{project.name}</span>
              <span>{project.plannedEndDate}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  
  export default ProjectStatistics;