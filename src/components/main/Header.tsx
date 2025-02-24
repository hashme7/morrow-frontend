import React, { useEffect, useState } from 'react';
import { FaUsers, FaProjectDiagram } from "react-icons/fa";
import { GrOverview } from "react-icons/gr";
import { BsFillKanbanFill } from "react-icons/bs";
import { TbApi } from "react-icons/tb";
import { HiOutlineLogout, HiMenuAlt3 } from "react-icons/hi";
import { CgProfile } from "react-icons/cg";
import { useLocation, useNavigate } from 'react-router-dom';


const Header: React.FC<{logout:()=>void,xsMenu:Boolean,setXsMenu:(xsMenu:Boolean)=>void}> = ({logout,xsMenu,setXsMenu}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeButton,setActiveButton] = useState("");

  useEffect(()=>{
    const path = location.pathname.split('/').pop()
    if(path=='dashboard'){
      setActiveButton('overview');
    }else{
      setActiveButton(path || 'overview');
    }
  },[location.pathname]);


  const onComponentChange = (path:string) => {
    setActiveButton(path);
    navigate(`/dashboard/${path}`);
  };

  return (
    <div className="flex justify-between rounded-3xl items-center p-2 bg-zinc-950 text-white">
      <div className="flex flex-wrap space-x-2 md:space-x-4 justify-center">
        <button
          className={`p-1 sm:p-2 ${
            activeButton === "overview"
              ? "bg-white text-black"
              : "bg-transparent text-white"
          } rounded-full text-xs sm:text-sm`}
          onClick={() => onComponentChange("overview")}
        >
          <GrOverview />
          <span className="hidden sm:block">Overview</span>
        </button>
        <button
          className={`p-1 sm:p-2 ${
            activeButton === "board"
              ? "bg-white text-black"
              : "bg-transparent text-white"
          } rounded-full text-xs sm:text-sm md:text-sm`}
          onClick={() => onComponentChange("board")}
        >
          <BsFillKanbanFill />
          <span className="hidden sm:block">Board</span>
        </button>
        <button
          className={`p-1 sm:p-2 ${
            activeButton === "member"
              ? "bg-white text-black"
              : "bg-transparent text-white"
          } rounded-full text-xs sm:text-sm md:text-sm flex`}
          onClick={() => onComponentChange("member")}
        >
          <FaUsers className="mr-2" />
          <span className="hidden sm:block">Members</span>
        </button>
        <button
          className={`p-1 sm:p-2 ${
            activeButton === "api"
              ? "bg-white text-black"
              : "bg-transparent text-white"
          } rounded-full text-xs sm:text-sm md:text-sm`}
          onClick={() => onComponentChange("api")}
        >
          <TbApi />
          <span className="hidden sm:block">API</span>
        </button>
        <button
          className={`p-1 sm:p-2  ${
            activeButton === "diagram"
              ? "bg-white text-black"
              : "bg-transparent text-white"
          } rounded-full text-xs sm:text-sm md:text-sm`}
          onClick={() => onComponentChange("diagram")}
        >
          <FaProjectDiagram />
          <span className="hidden sm:block">DB Diagram</span>
        </button>
      </div>
      <div className="flex sm:gap-1 md:space-x-4 gap-2">
        <button
          className="material-icons text-sm sm:text-sm md:text-sm"
          onClick={logout}
        >
          <HiOutlineLogout />
          <span className="hidden sm:block">logout</span>
        </button>
        <button
          className="material-icons text-sm sm:text-sm md:text-sm"
          onClick={() => navigate("/profile")}
        >
          <CgProfile />
          <span className="hidden sm:block">Profile</span>
        </button>
        <HiMenuAlt3  className='block lg:hidden' onClick={()=>setXsMenu(!xsMenu)}/>
        {/* <button className="material-icons text-sm sm:text-sm md:text-sm">
          settings
        </button> */}
      </div>
    </div>
  );
};

export default Header;
