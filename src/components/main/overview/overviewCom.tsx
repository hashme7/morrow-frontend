import React from "react";
import ProjectInfo from "./ProjectInfo";
import ProgressBar from "./ProgressBar";
import ProjectStatistics from "./ProjectStatistics";
import RecentActivity from "./RecentActivity";

const OverView: React.FC = () => {
  const projectInfo = {
    title: "Promo Website",
    startDate: "Aug 1, 2023",
    deadline: "Aug 30, 2023",
    teamMembers: 5,
    projectLeader: "Nader Ahmed",
  };
  const projects = [
    { id: 1, name: "UK Research", deadline: "Aug 22, 2023" },
    { id: 2, name: "Promo Website", deadline: "Aug 30, 2023" },
  ];

  const activities = [
    "Floyd Miles joined the project",
    "Jenny Wilson joined the project",
    "Arlene assigned a task to you",
  ];

  return (
    <>
      <div className="p-8 grid grid-cols-2">
        <div className="m-1">
          <ProjectInfo {...projectInfo} />
        </div>
        <div className="m-1">
          <ProgressBar completed={70} hold={10} progress={25} pending={5} />
        </div>
        <div className="m-1">
          <ProjectStatistics projects={projects} />
        </div>
        <div className="m-1">
          <RecentActivity activities={activities} />
        </div>
      </div>
    </>
  );
};

export default OverView;
