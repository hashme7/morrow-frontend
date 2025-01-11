import React, { useEffect, useState } from 'react';
import { FaUsers } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';


const Header: React.FC = () => {
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
    <div className="flex flex-col md:flex-row justify-between rounded-3xl items-center p-2 bg-zinc-950 text-white space-y-2 md:space-y-0">
      <div className="flex flex-wrap space-x-2 md:space-x-4 justify-center">
        <button
          className={`p-1 sm:p-2 ${
            activeButton === "overview"
              ? "bg-white text-black"
              : "bg-transparent text-white"
          } rounded-full text-xs sm:text-sm`}
          onClick={() => onComponentChange("overview")}
        >
          Overview
        </button>
        <button
          className={`p-1 sm:p-2 ${
            activeButton === "board"
              ? "bg-white text-black"
              : "bg-transparent text-white"
          } rounded-full text-xs sm:text-sm md:text-sm`}
          onClick={() => onComponentChange("board")}
        >
          Board
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
        {/* <button
        // className={`p-1 sm:p-2 ${activeButton === 'files' ? 'bg-white text-black' : 'bg-transparent text-white'} rounded-full text-xs sm:text-sm md:text-sm`}
        >
          Files
        </button> */}
        <button
          className={`p-1 sm:p-2 ${
            activeButton === "api"
              ? "bg-white text-black"
              : "bg-transparent text-white"
            } rounded-full text-xs sm:text-sm md:text-sm`}
          onClick={()=>onComponentChange('api')}
        >
          API
        </button>
        <button
          className={`p-1 sm:p-2 hidden sm:block ${
            activeButton === "diagram"
              ? "bg-white text-black"
              : "bg-transparent text-white"
          } rounded-full text-xs sm:text-sm md:text-sm`}
          onClick={() => onComponentChange("diagram")}
        >
          DB Diagram
        </button>
      </div>
      <div className="flex space-x-2 md:space-x-4">
        <button
          className="material-icons text-sm sm:text-sm md:text-sm"
          onClick={() => navigate("/profile")}
        >
          Profile
        </button>
        {/* <button className="material-icons text-sm sm:text-sm md:text-sm">
          settings
        </button> */}
      </div>
    </div>
  );
};

export default Header;
