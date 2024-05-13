import moment from "moment";
import React from "react";
import { CgCalendarDates } from "react-icons/cg";
import { FaUserAlt } from "react-icons/fa";

const Profile = ({ user }) => {
  return (
    <>
      <div className="flex flex-col gap-2 items-center justify-center">
        <div className="avatar w-[250px] h-[250px] object-contain mb-1 border-1 border-slate-600 rounded-full mt-10 ">
          <img src={user?.avatar?.url} alt={"userimage"} />
        </div>
        <div className="flex flex-col items-center justify-center">
          <span className="text-black font-medium text-xl">{user?.name}</span>
          <span className="text-[#8b8b8c] text-[18px]">@{user?.username}</span>
        </div>

        <div className="w-1/2 bg-[#fedaef] rounded-xl  font-semibold flex text-left p-2 pl-3 text-[#610726] hover:cursor-pointer transition-all duration-500 hover:bg-[#fedaefc7]">
          {user?.bio} 
        </div>
        <div className="bg-[#e6f1fe] w-1/2 rounded-xl text-[#004493] font-semibold p-2 pl-3 hover:bg-[#0045932c] cursor-pointer transition-all duration-500">{moment(user?.createdAt).fromNow()}</div>

      </div>
    </>
  );
};


export default Profile;
