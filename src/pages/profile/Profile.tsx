import React, { useEffect, useState } from "react";
import Header from "../../components/ProfileSection/Header";
import ProfileSidebar from "../../components/ProfileSection/ProfileSidebar";
import Dev from "../../components/ProfileSection/Dev/Dev";
import Email from "../../components/ProfileSection/Email";
import Security from "../../components/ProfileSection/Security";
import { useAppDispatch, useAppSelector } from "../../store/hooks/hooks";
import { fetchUser } from "../../store/slices/profileSlice";
import mongoose from "mongoose";

const Profile: React.FC = () => {
  const [activeTab, setActiveTab] = useState("Dev");
  const { profile } = useAppSelector((state) => state);
  const dispatch = useAppDispatch();

  const renderActiveTab = () => {
    switch (activeTab) {
      case "Dev":
        return <Dev />;
      case "Email":
        return <Email />;
      case "Security":
        return <Security />;
    }
  };

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId && mongoose.Types.ObjectId.isValid(userId)) {
      const objectId = new mongoose.Types.ObjectId(userId);
      dispatch(fetchUser({ userId: objectId }));
    } else {
      console.error("Invalid userId in localStorage");
    }
  }, [dispatch]);

  return (
    <>
      <div className="flex-col h-screen bg-black">
        <Header setActiveTab={setActiveTab} activeTab={activeTab} />
        <div className="sm:flex mt-2">
          <ProfileSidebar profile={profile} />
          {renderActiveTab()}
        </div>
      </div>
    </>
  );
};

export default Profile;
