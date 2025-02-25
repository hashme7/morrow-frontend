import React, { useEffect, useState } from "react";
import { logout } from "../../store/slices/loginSlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks/hooks";
import SideBar from "../../components/main/Sidebar";
import Header from "../../components/main/Header";
import Notification from "../../components/Notification";
import { Outlet, useLocation } from "react-router-dom";
import LandingDiv from "../../components/main/landingDiv/LandingDiv";
import { clearSelectProject } from "../../store/slices/projectSlice";

const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const [notificationVisible, setNotificationVisible] =
    useState<boolean>(false);
  const [isOverview, setIsOverview] = useState<boolean>(false);
  const [notificationMessage, setNotificationMessage] = useState<string>("");
  const { selectProject } = useAppSelector((state) => state.project);
  const location = useLocation();
  const [isRequests, setIsRequests] = useState<boolean>(
    location.pathname == "/dashboard/requests"
  );
  const [xsMenu, setXsMenu] = useState<Boolean>(false); 

  const handleLogout = async () => {
    dispatch(logout());
    dispatch(clearSelectProject());
  };

  useEffect(() => {
    setIsRequests(location.pathname == "/dashboard/requests");
    setIsOverview(
      location.pathname == "/dashboard/overview" ||
        location.pathname == "/dashboard"
    );
  }, [location.pathname]);

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
        {!xsMenu && <SideBar showNotification={showNotification} xsMenu={xsMenu} />}
        <div className="h-full w-full bg-black">
          <div className="flex-1 p-4 ">
            {isOverview && <div>
            <img src="/assets/images/project.jpeg" alt=""  className="w-full"/></div>}
            <Header logout={handleLogout} xsMenu={xsMenu} setXsMenu={setXsMenu} />
            {xsMenu && <SideBar showNotification={showNotification} xsMenu={xsMenu}/>}
            <Notification
              message={notificationMessage}
              visible={notificationVisible}
            />
          </div>
          {selectProject || isRequests ? (
            <div>
              <Outlet />
            </div>
          ) : (
            <LandingDiv />
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
