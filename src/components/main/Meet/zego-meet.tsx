import React, { useRef, useEffect } from "react";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { useAppDispatch, useAppSelector } from "../../../store/hooks/hooks";
import gsap from "gsap";
import { fetchUser } from "../../../store/slices/profileSlice";
import extractIdFromToken from "../../../utils/decodeToken";
import mongoose from "mongoose";

function generateRandomID(len: number = 5): string {
  const chars =
    "12345qwertyuiopasdfgh67890jklmnbvcxzMNBVCZXASDQWERTYHGFUIOLKJP";
  return Array.from({ length: len }, () =>
    chars.charAt(Math.floor(Math.random() * chars.length))
  ).join("");
}

const ZegoMeet: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { selectProject } = useAppSelector((state) => state.project);
  const { email, userName } = useAppSelector((state) => state.profile);
  const dispatch = useAppDispatch();

  const roomID = selectProject?.id?.toString(); // Ensure roomID is a string

  const initializeMeeting = async (element: HTMLDivElement | null) => {
    if (!element || !roomID || !email) return;

    const appID = 1270913245;
    const serverSecret = "a5f0c9732f550800457fb4a809d6bded";

    // Generate the kit token with userName and userID
    const user = userName || email; // Prefer user's name; fallback to email
    const userID = generateRandomID(); // Ensure unique user ID for the session

    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appID,
      serverSecret,
      roomID,
      userID,
      user
    );

    // Initialize the meeting room
    const zp = ZegoUIKitPrebuilt.create(kitToken);
    zp.joinRoom({
      container: element,
      sharedLinks: [
        {
          name: "Copy link",
          url: `${window.location.origin}/dashboard/meet?roomID=${roomID}`,
        },
      ],
      scenario: {
        mode: ZegoUIKitPrebuilt.GroupCall,
      },
      onLeaveRoom: () => {
        localStorage.removeItem("runningRoomID");
      }
    });
    
  };

  useEffect(() => {
    // Dispatch fetchUser only if needed
    if (!email) {
      dispatch(
        fetchUser({ userId: new mongoose.Types.ObjectId(extractIdFromToken()) })
      );
    }

    if (containerRef.current) {
      initializeMeeting(containerRef.current);
      // Animate the container on mount
      gsap.fromTo(
        containerRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 1, ease: "power2.out" }
      );
    }
  }, [dispatch, email, roomID]); 

  return (
    <div
      ref={containerRef}
      className="w-full h-screen bg-black text-white flex justify-center items-center"
    >
      {/* Render Zego Meeting Room */}
      <div style={{ width: "100vw", height: "100vh" }}></div>
    </div>
  );
};

export default ZegoMeet;
