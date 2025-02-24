import { useDisclosure } from "@nextui-org/react";
import React, { useEffect } from "react";
import { FaCalendarAlt, FaCog, FaTasks, FaUsers } from "react-icons/fa";
import PModal from "./modals/ProjectCreateModal";
import { useAppDispatch, useAppSelector } from "../../store/hooks/hooks";
import { getProjects, selectProject } from "../../store/slices/projectSlice";
import { IProject } from "../../types/project";
import { useLocation, useNavigate } from "react-router-dom";

interface SideBarProps {
  showNotification: (message: string) => void;
  xsMenu: Boolean;
}

const SideBar: React.FC<SideBarProps> = ({ showNotification, xsMenu }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const dispatch = useAppDispatch();
  const { projects, selectProjectId } = useAppSelector(
    (state) => state.project
  );
  const { requests } = useAppSelector((state) => state.request);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    dispatch(getProjects());
  }, [requests]);

  const handleSelectProject = (id: number) => {
    dispatch(selectProject(id));
  };

  return (
    <>
      <aside
        className={` text-zinc-600 bg-zinc-950  lg:block ${
          xsMenu ? ` h-44 p-1 m-1 rounded-xl` : "hidden min-h-screen h-full w-48 p-4 m-3"
        }`}
      >
        <h1
          className={`text-2xl font-semibold mt-2 text-white ${
            xsMenu ? "hidden" : "block"
          }`}
        >
          Morrow
        </h1>
        <nav
          className={`${
            xsMenu
              ? "flex h-fit justify-center"
              : "border-top mt-4 border-t-2 border-zinc-600 border-b-2 h-64"
          } `}
        >
          <div
            className={`pb-3 text-white mt-5 ${xsMenu ? "hidden" : "block"}`}
          >
            Menu
          </div>
          <ul
            className={`${xsMenu ? "flex gap-3 m-2 " : "flex-col space-y-5"} `}
          >
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
          </ul>
        </nav>
        <div className="mt-auto">
          <button
            className={`bg-white text-black  mt-4 rounded-md w-full ${
              xsMenu ? "relative p-1 w-5/6" : "p-2"
            }`}
            onClick={onOpen}
          >
            Create Project
          </button>
          <h3 className="text-white text-xl font-bold mt-4 ">Projects</h3>
        </div>
        <div className="mt-auto ">
          <ul
            className={`${
              xsMenu ? "grid grid-cols-3 text-small" : "text-xl  font-semibold "
            } p-1`}
          >
            {projects.map((project: IProject) => (
              <li
                className={` ${
                  project.id == selectProjectId ? "text-white" : "text-zinc-600"
                }  hover:cursor-pointer mt-2`}
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
