import React from "react";
import AppLayout from "../component/layout/AppLayout";

const Home = () => {
  return (
    <>
      <div className="text-black font-bold text-center p-4 text-2xl tracking-wider  ">
        Select A Friend To Chat
      </div>
    </>
  );
};

export default AppLayout()(Home);
