import React from "react";
import Logo from "../../../public/assets/logos/Logo";

const Header: React.FC = () => {
  return (
    <div className="w-full h-screen absolute top-0">
      <div className="absolute top-2">
        <Logo />
      </div>
    </div>
  );
};

export default Header;
