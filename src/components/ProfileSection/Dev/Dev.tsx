import React, { useEffect, useRef, useState } from "react";
import { FaCheck, FaEdit } from "react-icons/fa";
import ProjectNPortfolio from "./Projects&Portfolio";
import WorkHistory from "./WorkHistory";
import WorkWith from "./WorkedWith";
import Skills from "./Skills";
import Education from "./Education";
import Language from "./Language";
import WorkHours from "./WorkHour";
import LinkedAccounts from "./LinkedAcconts";
import HourlyRate from "./HourlyRate";
import {gsap} from  'gsap'

const Dev: React.FC = () => {
  const devRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const devElement = devRef.current;
    gsap.fromTo(devElement, 
      { opacity: 0, x: '100%' }, 
      { opacity: 1, x: '0%', duration: 1, ease: "power1.out" }
    );
    return () => {
      gsap.to(devElement, { opacity: 0, x: '-100%', duration: 0.3, ease: "power3.in" });
    };
  }, []);
  const [editMode, setEditMode] = useState({
    summary: false,
    description: false,
    fee: false,
  });

  const toggleEditMode = (field: string) => {
    setEditMode((prev) => ({
      ...prev,
      [field]: !prev[field as keyof typeof prev],
    }));
  };
  return (
    <>
      <div className="w-full rounded p-2 lg:grid" ref={devRef}>
        {/* summary */}
        <div className="relative mb-2 md:grid-cols">
          <h3 className="font-bold text-xl">Summary</h3>
          {editMode.summary ? (
            <>
              <input type="text" className="w-full rounded p-2 mt-1" />
              <span
                className="absolute right-0 top-0 p-2 cursor-pointer"
                onClick={() => toggleEditMode("summary")}
              >
                <FaCheck />
              </span>
            </>
          ) : (
            <>
              <p className="text-small text-zinc-600 mt-1">
                Building & Landscape Architecture | Docker, ExpressJS,
                JavaScript
              </p>
              <span
                className="absolute right-0 top-0 p-2 cursor-pointer"
                onClick={() => toggleEditMode("summary")}
              >
                <FaEdit />
              </span>
            </>
          )}
        </div>
        {/* description */}
        <div className="relative mb-2">
          <h3 className="font-bold text-xl">Description</h3>
          {editMode.description ? (
            <>
              <input
                type="text"
                name="description"
                className="w-full rounded mt-1 p-2"
              />{" "}
              <span
                className="absolute right-0 top-0 p-1"
                onClick={() => toggleEditMode("description")}
              >
                <FaCheck />
              </span>
            </>
          ) : (
            <>
              <p className="text-small text-zinc-600 mt-1">
                Dedicated MERN Stack Developer with practical experience
                including internship for more than a year building dynamic and
                scalable web applications. My expertise includes TypeScript,
                Node.js, Express.js, React.js and MongodB.
              </p>{" "}
              <span
                className="absolute right-0 top-0 p-1"
                onClick={() => toggleEditMode("description")}
              >
                <FaEdit />
              </span>
            </>
          )}
        </div>
        <div className="grid grid-cols-2  p-1">
          <ProjectNPortfolio />
          <WorkHistory />
          <WorkWith />
          <Skills />
          <Education />
          <Language />
          <div>
            <WorkHours />
            <HourlyRate />
          </div>
          <LinkedAccounts />
        </div>
      </div>
    </>
  );
};

export default Dev;
