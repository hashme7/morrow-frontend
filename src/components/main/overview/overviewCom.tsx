import React from "react";
import ProjectInfo from "./ProjectInfo";
import ProgressBar from "./ProgressBar";
import ProjectStatistics from "./ProjectStatistics";
import RecentActivity from "./RecentActivity";
import { useAppSelector } from "../../../store/hooks/hooks";

const OverView: React.FC = () => {
  const { selectProject ,projects} = useAppSelector((state) => state.project);
  const projectInfo = {
    name: selectProject?.name || "",
    plannedStartDate: selectProject?.plannedStartDate || "2/2/2024",
    plannedEndDate: selectProject?.plannedEndDate || "2/2/2024",
    teamMembers: 1,
    projectLeader: "zayh",
    projectDescription: selectProject?.projectDescription || "dk",
  };
  

  const activities = [
    "Floyd Miles joined the project",
    "Jenny Wilson joined the project",
    "Arlene assigned a task to you",
  ];

  return (
    <>
      <div className="p-1 grid grid-cols-1 lg:grid-cols-2 text-small ">
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
