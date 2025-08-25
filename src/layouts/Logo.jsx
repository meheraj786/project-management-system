import React from "react";
import smallLogo from "../assets/smallLogo.svg";
import { Link } from "react-router";

const Logo = ({ className }) => {
  return (
    <Link to="/">
      <h1
        className={`font-heading font-bold text-[32px] flex items-center justify-center gap-x-1 ${className}`}
      >
        {" "}
        <img className="w-[34px]" src={smallLogo} alt="" /> Collab
        <span className="text-primary">rix.</span>
        <span className="text-xs mb-2">Beta</span>
      </h1>
    </Link>
  );
};

export default Logo;
