import React from "react";
interface RecentActivityProps {
  activities: string[];
}

const RecentActivity: React.FC<RecentActivityProps> = ({ activities }) => {
  return (
    <div className="bg-zinc-900 p-4 rounded-lg">
      <h3 className="text-lg font-semibold">Recent Activity</h3>
      <ul className="mt-4">
        {activities.map((activity, index) => (
          <li key={index} className="text-sm text-gray-400 mt-2">
            {activity}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentActivity;
