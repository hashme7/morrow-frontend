import React, { useEffect, useState } from "react";
import { logout } from "../../store/slices/loginSlice";
import { useAppDispatch,useAppSelector } from "../../store/hooks/hooks";
import SideBar from "../../components/main/Sidebar";
import Header from "../../components/main/Header";
import Notification from "../../components/Notification";
import { Outlet, useLocation } from "react-router-dom";
import LandingDiv from "../../components/main/landingDiv/LandingDiv";


const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const [notificationVisible, setNotificationVisible] = useState<boolean>(false);
  const [notificationMessage, setNotificationMessage] = useState<string>("");
  const {selectProject} = useAppSelector((state)=>state.project);
  const location = useLocation();
  const [isRequests, setIsRequests] = useState<boolean>(location.pathname == '/dashboard/requests');

  const handleLogout = async () => {
    dispatch(logout());
  };
  useEffect(()=>{
    setIsRequests(location.pathname == '/dashboard/requests')
    console.log(location.pathname,"pathname",selectProject)
  },[location.pathname])

  const showNotification = (message: string) => {
    setNotificationMessage(message);
    setNotificationVisible(true);
    setTimeout(() => {
      setNotificationVisible(false);
    }, 3000);
  };

  return (
    <>
      <div className="flex">
        <SideBar showNotification={showNotification} />
        <div className="h-screen w-full bg-black">
          <div className="flex-1 p-4 ">
            <Header />
            <Notification
              message={notificationMessage}
              visible={notificationVisible}
            />
          </div>
          {selectProject || isRequests ? (<div>
            <Outlet/>
          </div>) : <LandingDiv/>}
          
          <div>
            <button onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
