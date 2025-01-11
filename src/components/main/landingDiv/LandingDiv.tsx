import React from "react";

const LandingDiv: React.FC = () => {
  return (
    <div className="relative h-screen w-full">
      {/* Background video */}
      <video
        className="absolute top-0 left-0 w-full h-full object-cover"
        src="/path-to-your-video.mp4"
        autoPlay
        loop
        muted
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-4xl font-bold mb-4">Welcome to Morrow</h1>
          <p className="text-lg">
            Choose a project or create a new one to start managing effectively.
          </p>
        </div>
      </div>  
    </div>
  );
};

export default LandingDiv;
