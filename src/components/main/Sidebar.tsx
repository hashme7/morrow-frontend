import { useDisclosure } from "@nextui-org/react";
import React, { useEffect } from "react";
import { FaCalendarAlt, FaCog, FaTasks, FaUsers } from "react-icons/fa";
import PModal from "./modals/ProjectCreateModal";
import { useAppDispatch, useAppSelector } from "../../store/hooks/hooks";
import { getProjects, selectProject } from "../../store/slices/projectSlice";
import { IProject } from "../../types/project";
import { useLocation, useNavigate } from "react-router-dom";
import extractIdFromToken from "../../utils/decodeToken";

interface SideBarProps {
  showNotification: (message: string) => void;
}

const SideBar: React.FC<SideBarProps> = ({ showNotification}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const dispatch = useAppDispatch();
  const { projects, selectProjectId } = useAppSelector((state) => state.project);
  const { requests } = useAppSelector((state) => state.request);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const userId = extractIdFromToken();
    if (userId) {
      dispatch(getProjects(userId));
    }
  }, [requests]);

  const handleSelectProject = (id:number)=>{
    dispatch(selectProject(id));
  }

  return (
    <>
      <aside className="min-h-screen h-full w-48 p-4 m-3 text-zinc-600 bg-zinc-950 rounded-3xl">
        <h1 className="text-2xl font-semibold mt-2 text-white">Morrow</h1>
        <nav className="border-top mt-4 border-t-2 border-zinc-600 border-b-2 h-64">
          <div className="pb-3 text-white mt-5">Menu</div>
          <ul className="flex-col space-y-5">
            <li
              className={`flex items-center hover:cursor-pointer ${
                location.pathname == "/dashboard/requests"
                  ? "text-white"
                  : "text-zinc-600"
              }`}
              onClick={() => navigate("/dashboard/requests")}
            >
              <FaTasks className="mr-3" /> Requests
            </li>
            <li
              className={`flex items-center hover:cursor-pointer  ${
                location.pathname == "/dashboard/chats"
                  ? "text-white"
                  : "text-zinc-600"
              }`}
              onClick={() => navigate("/dashboard/chats")}
            >
              <FaCalendarAlt className="mr-3" /> Chats
            </li>
            <li
              className={`flex items-center hover:cursor-pointer  ${
                location.pathname == "/dashboard/meet"
                  ? "text-white"
                  : "text-zinc-600"
              }`}
              onClick={() => navigate("/dashboard/meet")}
            >
              <FaUsers className="mr-3" /> Meet
            </li>
            <li className="flex items-center hover:cursor-pointer">
              <FaCog className="mr-3" /> Settings
            </li>
          </ul>
        </nav>
        <div className="mt-auto">
          <h3 className="text-white text-lg mt-4">Projects</h3>
          <button
            className="bg-white text-black p-2 mt-4 rounded-md w-full"
            onClick={onOpen}
          >
            Create Project
          </button>
        </div>
        <div className="mt-auto ">
          <ul>
            {projects.map((project: IProject) => (
              <li
                className={` ${
                  project.id == selectProjectId ? "text-white" : "text-zinc-600"
                }  text-xl  font-semibold hover:cursor-pointer mt-2`}
                key={project.id}
                onClick={() => handleSelectProject(project.id)}
              >
                {project.name}
              </li>
            ))}
          </ul>
        </div>
      </aside>
      <PModal
        isOpen={isOpen}
        onClose={onClose}
        showNotification={showNotification}
      />
    </>
  );
};

export default SideBar;
