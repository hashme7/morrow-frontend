import React from "react";
import LinkedAccontsCard from "../Cards/LikedAccountsCard";

const LinkedAccounts: React.FC = () => {
  return (
    <>
      <div className="col-span-2 mt-1 rounded-large bg-zinc-800">
        <LinkedAccontsCard/>
      </div>
    </>
  );
};

export default LinkedAccounts;
