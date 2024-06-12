import { Stack } from "@mui/material";
import React from "react";
import { BouncingSkeleton } from "../styles/StyledComponent";
import "../styles/Loader.css"

const Loader = () => {

  return (
    <>
      <section className="dots-container w-[100vw] h-[100vh] flex items-center justify-center">
  <div className="dot"></div>
  <div className="dot"></div>
  <div className="dot"></div>
  <div className="dot"></div>
  <div className="dot"></div>
</section>
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
