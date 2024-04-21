import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="w-full h-screen backdrop-blur-2xl gap-4 flex flex-col justify-center items-center">
      <div className="flex justify-center items-center gap-2 text-6xl md:text-8xl">
        <span className="font-bold text-[#004c54c0]">4</span>
        <span className="font-bold text-white">0</span>
        <span className="font-bold text-[#004c54c0]">4</span>
      </div>
      <div className="text-[#D9D1C2] text-4xl md:text-6xl h-16">
        Opps. Sorry
      </div>
      <div className="text-xl text-center font-bold tracking-wide">
        we Can't Find The Page You Are Looking For...
      </div>
      <button className="bg-[#004c549c] rounded-3xl pl-4 pr-4 pt-1 pb-1 mt-6">
        <Link to={"/"} className="hover:text-gray-200">
          Back To Home
        </Link>
      </button>
    </div>
  );
};

export default NotFound;
