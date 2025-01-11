interface Project {
    id: number;
    name: string;
    deadline: string;
  }
  
  interface ProjectStatisticsProps {
    projects: Project[];
  }
  
import React from 'react';
  const ProjectStatistics: React.FC<ProjectStatisticsProps> = ({ projects }) => {
    return (
      <div className="bg-zinc-900 p-4 rounded-lg">
        <h3 className="text-lg font-semibold">Project Statistics</h3>
        <ul className="mt-4">
          {projects.map((project) => (
            <li key={project.id} className="flex justify-between text-sm text-gray-400 mt-2">
              <span>{project.name}</span>
              <span>{project.deadline}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  
  export default ProjectStatistics;