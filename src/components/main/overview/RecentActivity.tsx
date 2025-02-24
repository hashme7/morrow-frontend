import React from "react";
interface RecentActivityProps {
  activities: string[];
}

const RecentActivity: React.FC<RecentActivityProps> = ({ activities }) => {
  return (
    <div className="bg-zinc-950 p-4 rounded-2xl h-64">
      <h3 className="text-lg font-semibold">Recent Activity</h3>
      { 
        activities.length?(<ul className="mt-4">
        {activities.map((activity, index) => (
          <li key={index} className="text-sm text-gray-400 mt-2">
            {activity}
          </li>
        ))}
      </ul>):<h1>no recent activity</h1>
      }
      
    </div>
  );
};

export default RecentActivity;
