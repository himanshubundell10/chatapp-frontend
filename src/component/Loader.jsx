import { Stack } from "@mui/material";
import React from "react";
import { BouncingSkeleton } from "../styles/StyledComponent";
import { hexToRgba70 } from "../utils/features";
import Navbar from "./Navbar";

const Loader = () => {
  const isMediumScreen = window.innerWidth >= 750;
  const isSmallScreen = window.innerWidth >= 650;
  const hideFirstDiv = !isSmallScreen;
  const hideThirdDiv = !isMediumScreen;

  const backgroundColor = hexToRgba70("#193cc7");

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: hideThirdDiv
      ? hideFirstDiv
        ? "100%"
        : "25% 75%"
      : "25% 50% 25%",
    height: "calc(100vh - 2.5rem)",
  };
  return (
    <>
      <Navbar />
      <div style={gridStyle}>
        {/* first div */}
        <div
          style={{ backgroundColor: backgroundColor }}
          className="hidden sm:block backdrop-blur-2xl"
        >
          <div className="w-full flex flex-col  gap-4 justify-start mt-10 items-start">
            <div className="skeleton h-4 w-28 m-0 p-0"></div>
            <div className="skeleton h-4 w-1/2 m-0 p-0"></div>
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="skeleton h-4 w-full"></div>
            ))}
          </div>
        </div>

        {/* second div */}
        <div
          style={{ backgroundColor: backgroundColor }}
          className="backdrop-blur-2xl relative "
        >
          <div className="flex flex-col gap-6 w-full  h-full items-start">
            <div className="skeleton h-4 w-28 m-0 p-0"></div>
            <div className="skeleton h-4 w-1/2 m-0 p-0"></div>
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="skeleton h-4 w-full"></div>
            ))}
          </div>
          <div className="skeleton h-6 w-full absolute bottom-4"></div>
        </div>

        {/* third div */}
        <div
          // style={{ backgroundColor: backgroundColor }}
          className="md:block hidden backdrop-blur-2xl "
        >
          <div className="flex flex-col gap-4 w-full h-full items-center  ">
            <div className="skeleton w-24 h-24 rounded-full "></div>
            <div className="skeleton h-4 w-1/2"></div>
            <div className="skeleton h-4 w-1/2"></div>
            <div className="skeleton h-4 w-1/2"></div>
          </div>
        </div>
      </div>
    </>
  );
};

const TypingLoader = () => {
  return (
    <Stack
      spacing={"0.5rem"}
      direction={"row"}
      padding={"0.5rem"}
      justifyContent={"center"}
    >
      <BouncingSkeleton
        variant="circular"
        width={15}
        height={15}
        style={{ animationDelay: "0.1s" }}
      />
      <BouncingSkeleton
        variant="circular"
        width={15}
        height={15}
        style={{ animationDelay: "0.2s" }}
      />
      <BouncingSkeleton
        variant="circular"
        width={15}
        height={15}
        style={{ animationDelay: "0.4s" }}
      />
      <BouncingSkeleton
        variant="circular"
        width={15}
        height={15}
        style={{ animationDelay: "0.6s" }}
      />
    </Stack>
  );
};

export { TypingLoader };
export default Loader;
