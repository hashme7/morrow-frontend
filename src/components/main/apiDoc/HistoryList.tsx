import { Button } from "@nextui-org/react";
import React from "react";
import { FaPlus } from "react-icons/fa";
import { IApi } from "../../../types/api";

const HistoryList: React.FC<{apis:IApi[]}> = ({apis}) => {
 
  const getMethodColor = (method: string) => {
    switch (method) {
      case "GET":
        return "text-green-500";
      case "POST":
        return "text-blue-500"; // Blue for POST method
      case "PUT":
        return "text-yellow-500"; // Yellow for PUT method
      case "DELETE":
        return "text-red-500"; // Red for DELETE method
      default:
        return "text-gray-500"; // Default gray for unknown methods
    }
  };

  return (
    <>
      <Button
        className="w-64 bg-zinc-950 mb-1 rounded-xl h-10"
        endContent={<FaPlus />}
      >
        New Request{" "}
      </Button>
      <div
        className={`relative top-0 h-full ${"w-64"} transition-width duration-300 rounded-xl shadow-lg bg-zinc-950`}
      >
        <div className="p-4">
          <h2 className="text-lg font-bold mb-4 ">Request History</h2>
          <ul>
            {apis.length > 0 ? (
              apis.map((item, index) => (
                <li key={index} className="mb-2 rounded-xl bg-zinc-900 p-1">
                  <div className="flex justify-between rounded-xl ">
                    <span
                      className={`font-medium ${getMethodColor(item.method)}`}
                    >
                      {item.method}
                    </span>
                    <span className="text-sm text-gray-500">
                      
                    </span>
                  </div>
                  <div className="text-sm">{item.url}</div>
                </li>
              ))
            ) : (
              <p>No request history available.</p>
            )}
          </ul>
        </div>
      </div>
    </>
  );
};

export default HistoryList;
