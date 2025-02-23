import React from "react";
import ProjectInfo from "./ProjectInfo";
import ProgressBar from "./ProgressBar";
import ProjectStatistics from "./ProjectStatistics";
import RecentActivity from "./RecentActivity";

const OverView: React.FC = () => {
  const projectInfo = {
    name: "Promo Website",
    plannedStartDate: "Aug 1, 2023",
    plannedEndDate: "Aug 30, 2023",
    teamMembers: 5,
    projectLeader: "Nader Ahmed",
    projectDescription:"efjaksdjfkajdskf dkjfaksjd;fkaskd faskdfa;ksdjfkajsd fa dskfjaskdfjaksjdfkasjdkf askdjfkajsd faskdjfkajsdkfjaksdjfk asdfja;ksdjfa;ksdjfkajs;dkfj",
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
      <div className="p-1 grid grid-cols-2">
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
