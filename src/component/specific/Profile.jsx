import moment from "moment";
import React from "react";

const Profile = ({ user }) => {
  return (
    <>
      <div className="flex flex-col gap-2 items-center justify-center mt-10 w-full ">
        <div className="w-[220px] h-[220px] relative">
          <div className="full h-full object-contain rounded-full">
            <img src={user?.avatar?.url} alt={"userimage"} />
          </div>
          <div className="bg-green-500 rounded-full w-3 h-3 absolute top-[180px] left-[184px] z-50"></div>
        </div>
        <div className="flex flex-col items-center justify-center">
          <span className="text-black font-medium text-xl">{user?.name}</span>
          <span className="text-[#8b8b8c] text-[18px]">@{user?.username}</span>
        </div>

        <div className="w-1/2 bg-[#E72C79] rounded-xl  font-light flex text-left p-2 pl-3 text-white hover:cursor-pointer transition-all duration-500 hover:bg-[#e72c7ad7]">
          {user?.bio}
        </div>
        <div className="bg-[#007AFF] w-1/2 rounded-xl text-white font-light p-2 pl-3 hover:bg-[#3596FF] cursor-pointer transition-all duration-500">
          {moment(user?.createdAt).fromNow()}
        </div>
      </div>
    </>
  );
};

export default Profile;
