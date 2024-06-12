import React from "react";
import "../styles/MiniLoader.css";

const MiniLoader = () => {
  return (
    <div className="h-full w-full flex items-center justify-center">
      <div className="spinner"></div>
    </div>
  );
};

export default MiniLoader;
